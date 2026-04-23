import {defineStore} from "pinia";
import api from "@/services/api.js";
import {ref} from "vue";

export const useExpenseStore = defineStore('expense', () => {
    const loading = ref(false)
    const error = ref(null)
    const data = ref(null);
    function setError(msg) {
        error.value = msg
    }

    function clearError() {
        error.value = null
    }


    async function getExpenses(){
        clearError();
        loading.value = true
        try{
            const res = await api.get('/user/expenses');
            if(res.data.success === true){
                data.value = res.data.data;
                return true;
            }else{
                setError('Something went wrong.')
            }
        }catch(err){
            setError('Something went wrong.')
        }finally {
            loading.value = false
        }
    }

    async function addExpense(body){
        clearError();
        loading.value = true
        try{
            const res = await api.post('/user/expense', body);
            if(res.data.success === true){
                data.value = res.data.data;
                return true;
            }else{
                setError('Something went wrong.')
            }
        }catch(err){
            setError('Something went wrong.')
        }finally {
            loading.value = false
        }
    }

    return {
        getExpenses, loading, error, data, addExpense
    }


});