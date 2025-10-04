export const formatSalaryAmount = (value: number) => {
    if (!value && value !== 0) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatSalary = (
    value: number,
    options: {
        currency?: boolean;
        decimal?: boolean;
        abbreviated?: boolean;
        decimalPlaces?: number;
    } = {
        currency: true,
        decimal: true,
        abbreviated: false,
        decimalPlaces: 2,
    }
): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '0';
    }

    const decimalPlaces = options.decimalPlaces ?? 2;

    const formatNumber = (num: number): string => {
        if (options.abbreviated) {
            if (num >= 1_000_000_000) {
                return (num / 1_000_000_000).toFixed(decimalPlaces) + 'B';
            }
            if (num >= 1_000_000) {
                return (num / 1_000_000).toFixed(decimalPlaces) + 'M';
            }
            if (num >= 1_000) {
                return (num / 1_000).toFixed(decimalPlaces) + 'K';
            }
        }

        const fixedNum = options.decimal ? num.toFixed(decimalPlaces) : Math.floor(num).toString();
        const parts = fixedNum.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return options.decimal && parts[1] ? parts.join(',') : parts[0];
    };

    const formatted = formatNumber(value);
    return options.currency ? `${formatted}` : formatted;
};


export function formatNumberInFull(number: number): string {
    // Trata números negativos
    if (number < 0) {
        return '-' + formatNumberInFull(-number);
    }
    // Caso especial para zero
    if (number === 0) {
        return '0';
    }
    // Definição das scales
    const scales = [
        { valor: 1e12, nome: " Trilhões" },
        { valor: 1e9, nome: " Bilhões" },
        { valor: 1e6, nome: " Milhões" },
        { valor: 1e3, nome: " Mil" },
    ];
    // Verifica cada scale
    for (const scale of scales) {
        if (number >= scale.valor) {
            const AbbreviatedValue = number / scale.valor;
            // Se for um número inteiro, não exibe decimais
            if (Number.isInteger(AbbreviatedValue)) {
                return AbbreviatedValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }) + '' + scale.nome;
            }
            // Se tiver fração, exibe até 1 casa decimal
            else {
                return AbbreviatedValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 3
                }) + '' + scale.nome;
            }
        }
    }
    // Para números menores que 1000, apenas formata com separadores
    return number.toLocaleString('pt-BR');
}