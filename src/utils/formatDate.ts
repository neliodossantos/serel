const formatDate = {
    getDay(dateString: string): number {
        const data = new Date(dateString);
        return data.getDate();
    },
    getMonth(dateString: string): string {
        const meses: string[] = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const data = new Date(dateString);
        return meses[data.getMonth()];
    },
    getYear(dateString: string): number {
        const data = new Date(dateString);
        return data.getFullYear();
    },
    getDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }
}
export default formatDate;
