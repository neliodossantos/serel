<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import type { Company } from '@/types/Company'

interface Props {
  placeholder?: string
  items: Company[]
  maxResults?: number
  label?: string
  disabled?: boolean
  modelValue?: Company | null
  allowCreate?: boolean
  searchMinLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pesquisar empresa...',
  maxResults: 8,
  label: '',
  disabled: false,
  modelValue: null,
  allowCreate: true,
  searchMinLength: 2
})

const emit = defineEmits<{
  (e: 'select', value: Company | null): void
  (e: 'update:modelValue', value: Company | null): void
  (e: 'clear', value: any): void
  (e: 'reportMissing', value: boolean, name: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const searchQuery = ref('')
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const selectedCompany = ref<Company | null>(props.modelValue)
const inputRef = ref<HTMLInputElement>()
const dropdownRef = ref<HTMLElement>()
const isLoading = ref(false)

// Computed para busca mais inteligente
const filteredItems = computed(() => {
  if (selectedCompany.value) return []
  
  if (!searchQuery.value) {
    return props.items.slice(0, props.maxResults)
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return props.items
    .filter(item => {
      const name = item.name?.toLowerCase() || ''
      // Busca por início da palavra ou por qualquer parte do nome
      return name.startsWith(query) || name.includes(query)
    })
    .sort((a, b) => {
      const aName = a.name?.toLowerCase() || ''
      const bName = b.name?.toLowerCase() || ''
      
      // Prioriza matches que começam com a query
      const aStartsWith = aName.startsWith(query)
      const bStartsWith = bName.startsWith(query)
      
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
      
      // Depois ordena alfabeticamente
      return aName.localeCompare(bName)
    })
    .slice(0, props.maxResults)
})

const showNotFound = computed(() => {
  return searchQuery.value.length >= props.searchMinLength &&
      filteredItems.value.length === 0 &&
      !selectedCompany.value &&
      props.allowCreate
})

const handleInput = () => {
  if (selectedCompany.value) return
  isOpen.value = true
  highlightedIndex.value = -1
}

const handleFocus = () => {
  if (selectedCompany.value) return
  isOpen.value = true
  highlightedIndex.value = -1
  emit('focus')
}

const selectItem = (item: Company | null) => {
  selectedCompany.value = item
  searchQuery.value = item?.name || ''
  isOpen.value = false
  highlightedIndex.value = -1
  emit('select', item)
  emit('update:modelValue', item)
}

const clearSelection = () => {
  selectedCompany.value = null
  searchQuery.value = ''
  isOpen.value = false
  highlightedIndex.value = -1
  emit('clear', selectedCompany.value)
  emit('update:modelValue', null)
  inputRef.value?.focus()
}

const reportMissingCompany = () => {
  emit('reportMissing', true, searchQuery.value)
  searchQuery.value = ''
  isOpen.value = false
}

// Função melhorada para scroll automático
const scrollToHighlighted = () => {
  if (highlightedIndex.value >= 0) {
    nextTick(() => {
      const list = dropdownRef.value?.querySelector('.select-company-list')
      const items = list?.querySelectorAll('li')
      const item = items?.[highlightedIndex.value]
      
      if (item && list) {
        const itemTop = (item as HTMLElement).offsetTop
        const itemHeight = (item as HTMLElement).offsetHeight
        const itemBottom = itemTop + itemHeight
        const listTop = list.scrollTop
        const listHeight = (list as HTMLElement).offsetHeight
        const listBottom = listTop + listHeight

        // Scroll suave para manter o item visível
        if (itemTop < listTop) {
          list.scrollTo({ top: itemTop - 8, behavior: 'smooth' })
        } else if (itemBottom > listBottom) {
          list.scrollTo({ top: itemBottom - listHeight + 8, behavior: 'smooth' })
        }
      }
    })
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value || selectedCompany.value) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (filteredItems.value.length > 0) {
        highlightedIndex.value = Math.min(
          highlightedIndex.value + 1,
          filteredItems.value.length - 1
        )
        scrollToHighlighted()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      scrollToHighlighted()
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredItems.value[highlightedIndex.value]) {
        selectItem(filteredItems.value[highlightedIndex.value])
      } else if (showNotFound.value && props.allowCreate) {
        reportMissingCompany()
      }
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      highlightedIndex.value = -1
      inputRef.value?.blur()
      break
    case 'Tab':
      isOpen.value = false
      highlightedIndex.value = -1
      break
  }
}

const handleBlur = (event: FocusEvent) => {
  // Verifica se o foco foi para dentro do dropdown
  const relatedTarget = event.relatedTarget as HTMLElement
  if (dropdownRef.value?.contains(relatedTarget)) {
    return
  }
  
  setTimeout(() => {
    isOpen.value = false
    highlightedIndex.value = -1
    emit('blur')
  }, 150)
}

// Fechar dropdown ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!dropdownRef.value?.contains(target) && !inputRef.value?.contains(target)) {
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Sincroniza com modelValue se fornecido
  if (props.modelValue) {
    selectedCompany.value = props.modelValue
    searchQuery.value = props.modelValue.name || ''
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch para mudanças no modelValue
const updateFromModelValue = () => {
  if (props.modelValue !== selectedCompany.value) {
    selectedCompany.value = props.modelValue
    searchQuery.value = props.modelValue?.name || ''
  }
}

// Simular loading para melhor UX (opcional)
const simulateSearch = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block mb-2 text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="!disabled && props.allowCreate" class="text-xs text-gray-500 ml-1">(Digite para buscar)</span>
    </label>
    
    <div class="relative" ref="dropdownRef">
      <div class="relative">
        <input 
          ref="inputRef"
          v-model="searchQuery" 
          type="text" 
          :placeholder="placeholder" 
          :disabled="disabled" 
          :readonly="selectedCompany !== null"
          @input="handleInput"
          @focus="handleFocus"
          @keydown="handleKeydown" 
          @blur="handleBlur"
          :class="[
            'w-full p-3 pr-10 text-gray-700 bg-white border border-[#D4D2D0] rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            selectedCompany ? '' : 'border-[#D4D2D0]',
            'hover:border-gray-400 focus:hover:border-transparent'
          ]"
          autocomplete="off"
          spellcheck="false"
        />
        
        <!-- Ícones do lado direito -->
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <!-- Loading spinner -->
          <div v-if="isLoading" class="animate-spin h-4 w-4 border-2 border-[#003F72] border-t-transparent rounded-full"></div>
          
          <!-- Clear button -->
          <button 
            v-else-if="searchQuery || selectedCompany" 
            @click="clearSelection" 
            class="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-1"
            type="button"
            tabindex="-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Dropdown arrow -->
          <svg 
            v-else
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Dropdown -->
      <div 
        v-if="(isOpen && filteredItems.length > 0) || showNotFound"
        class="absolute top-14 z-50 w-full bg-white border border-gray-300 border-t-0 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-200">
        <!-- Lista de itens -->
        <ul 
          v-if="filteredItems.length > 0" 
          class="select-company-list max-h-64 overflow-y-auto">
          <li 
            v-for="(item, index) in filteredItems"
            :key="item.id" 
            @mousedown.prevent="selectItem(item)"
            @mouseenter="highlightedIndex = index"
            :class="[
              'px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between group',
              index === 0 ? 'rounded-t-lg' : '',
              index === highlightedIndex 
                ? 'bg-[#003F72] text-white' 
                : 'hover:bg-gray-50 text-gray-700'
            ]"
          >
            <div class="flex items-center gap-3">
              <!-- Ícone da empresa -->
              <img :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold']"
                :src="item.logo">
              </img>
              
              <div>
                <div class="font-medium">{{ item.name }}</div>
                <div v-if="item.sector" :class="[
                  'text-xs',
                  index === highlightedIndex ? 'text-white/80' : 'text-gray-500'
                ]">
                  {{ item.sector }}
                </div>
              </div>
            </div>
            
            <!-- Indicador de seleção -->
            <div v-if="index === highlightedIndex" class="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </li>
        </ul>

        <!-- Mensagem de não encontrado -->
        <div v-else-if="showNotFound" class="p-4 border-t border-gray-100">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div class="flex-1">
              <p class="text-gray-600 text-sm mb-3">
                Não encontramos <strong>"{{ searchQuery }}"</strong> em nossa base de dados.
              </p>
              
              <button 
                @click="reportMissingCompany" 
                class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#003F72] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-150 border border-blue-200"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Solicitar adição da empresa
              </button>
            </div>
          </div>
        </div>
        
        <!-- Footer com informações -->
        <div v-if="filteredItems.length > 0" class="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between rounded-b-lg">
          <span>{{ filteredItems.length }} de {{ props.items.length }} empresas</span>
          <span class="flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">↑↓</kbd>
            navegar
            <kbd class="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs ml-2">Enter</kbd>
            selecionar
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animações suaves */
@keyframes slide-in-from-top {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slide-in-from-top 0.2s ease-out;
}

/* Scrollbar customizada mais elegante */
.select-company-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
}

.select-company-list::-webkit-scrollbar {
  width: 6px;
}

.select-company-list::-webkit-scrollbar-track {
  background: transparent;
}

.select-company-list::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.select-company-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.6);
}

/* Estilo para keyboard shortcuts */
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* Transições suaves para estados */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efeito de hover mais suave */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Placeholder customizado */
input::placeholder {
  color: #9CA3AF;
}

/* Seleção de empresa com efeito */
.company-selected {
  background: linear-gradient(135deg, #003F72 0%, #0056A3 100%);
}
</style>