import { useAuthStore } from "@/stores/auth.store.js";

const currencies = [
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
];

export function getSymbol(value, midstring='') {
    const userCurrency = useAuthStore().user?.currency;
    const match = currencies.find(c => c.code === userCurrency);
    const symbol = match?.symbol ?? '';
    return `${symbol}${midstring}${value}`;
}