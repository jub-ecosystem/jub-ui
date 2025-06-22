<script>

</script>
<template>
    <div class="footer-wrapper"> 
        <!-- <div class="footer__header"></div> -->
        <div class="footer">
            <!-- <img @load="on_load" class="mb--md" src="/images/muyal/muyal-black.png"> -->
            <p :class="{['text-size--'+text_size]:true,'text-align--justify':true}"> Contáctanos a través de nuestros diferentes canales y conoce más sobre la Plataforma tecnológica para la gestión, aseguramiento, intercambio y preservación de grandes volúmenes de datos en salud y construcción de un repositorio nacional de servicios de análisis de datos de salud.</p>
            
            <div class="footer__icons mb--md">
                <a class="flex justify-content--center align-items--center circle" href="https://www.facebook.com/cinvestav.lti" target="_blank">
                    <!-- <div >  -->
                        <img @load="on_load"  src="/images/icons/facebook-icon-1.svg"> 
                    <!-- </div>  -->
                </a>
                <a class="flex justify-content--center align-items--center circle" href="#">
                        <img @load="on_load" src="/images/icons/instagram-glyph-1.svg">
                </a>
                <a class="flex justify-content--center align-items--center circle" href="#">
                        <img @load="on_load" src="/images/icons/twitter-6.svg">
                </a>
            </div>
            <p class="footer__copyright">© Copyright 2020 - E-Salud by Cinvestav Tamaulipas</p>
        </div>
    </div>
</template>

<script>
import useBreakpoints from "vue-next-breakpoints";
  export default {
    setup(){
        const breakpoints = useBreakpoints({
            mobile:[240,768], // max-width: 600px
            tablet:[768,1024],
            desktop: [1281] // min-width: 601px
        });

        return {
            breakpoints
        };
    },
    data(){
        return {
            loaded_components: 0
        }
    },
    computed:{
        is_mobile(){
            return this.breakpoints.mobile.matches || this.breakpoints.tablet.matches
        },
        is_tablet (){
            return !this.breakpoints.mobile.matches && this.breakpoints.tablet.matches
        },
        text_size(){
            return this.is_mobile ? "xs" : "xs"
        }
    },
    methods:{
        on_load(){
            this.loaded_components+=1 

            if(this.loaded_components==4){
                this.$emit("loading")
            }
        }
    }
  }

</script>

<style>
    .footer-wrapper{
        position: relative;
        width: 100vw;
        display: block;
    }
    .footer{
        display: flex;
        align-items: center;
        align-content: center;
        flex-direction: column;
        padding: 20px;
        width: 100%;
    }
    .footer__header{
        width: 100%;
        height: 40px;
        background-color: black;
    }
    .footer p{
        text-align: center;
        justify-content: center;
        width: auto;
        min-width: 400px;
        max-width: 1050px;
        margin-bottom: 20px;
    }
    .footer__copyright{
     font-size: 12px;   
     color: gray;
    }
    .footer img{
        /* width: 10px; */
        /* height: 10%; */
        width: 100px;
    }
    .footer__icons{
        align-self: center;
        display: flex;
        /* margin-bottom: 10px; */
    }
    
    .footer__icons img{
        --size:25px;
        width: var(--size);
        height: var(--size);
        /* margin: 10px; */
        filter: invert();
    }
    .footer__icons .circle{
        background-color: black;
        position: relative;
        display: block;
        --size:60px;
        width: var(--size);
        height: var(--size);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
        /* background: red; */
        /* margin: 10px; */
    }
</style>
