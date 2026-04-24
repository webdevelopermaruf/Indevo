import {defineStore} from "pinia";
import api from "@/services/api.js";
import {ref} from "vue";

export const useSkillStore = defineStore('skill', () => {
    const loading = ref(false)
    const error = ref(null)
    const data = ref(null);
    const skilldata = ref(null);
    function setError(msg) {
        error.value = msg
    }

    function clearError() {
        error.value = null
    }


    async function getSkills() {
        clearError();
        loading.value = true
        try{
            const res = await api.get('/user/skills');
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

    async function getSpecificSkills(id) {
        clearError();
        loading.value = true
        try{
            const res = await api.get('/user/skill/'+ id);
            if(res.data.success === true){
                skilldata.value = res.data.data;
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
        getSkills, getSpecificSkills, loading, error, data
    }


});