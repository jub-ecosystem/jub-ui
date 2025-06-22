<template>
    <div class="flex justify-content--center align-items--center loader flex-direction--column">
        <img  width="300" src="/images/oca_2.png" alt="" class="mb--md loader__img">
        <p class="loader__text text-size--md">Cargando...</p>
    </div>
</template>
<script>
export default{
    mounted(){
        document.body.classList.add('prevent-scroll')
    },
    beforeUnmount(){
        document.body.classList.remove('prevent-scroll')
    }
}
</script>
<style scoped>

@keyframes loading {
    0%{
        opacity: 0.5;
    }
    25%{
        opacity: 0.1;
    }
    50%{
        opacity: 0.5;
    }
    100%{
        opacity: 1;
    }
}
.loader{
    position: absolute;
    top:0; 
    left:0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 100000;
    /* overflow: hidden; */
}
.loader__img{
    animation: loading 1.5s ease infinite;
}
.loader__text{
    animation: loading 1.5s ease infinite;
}
</style>