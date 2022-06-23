import{o as c,c as d,a as i,A as $,n as h,w as f,v as U,b,F as p,r as m,t as _,d as I,p as A,e as C,f as O,g as E,h as k,i as D,j as V,k as Y,l as P,m as W}from"./vendor.0ab732a4.js";const j=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerpolicy&&(a.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?a.credentials="include":r.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function l(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}};j();var g=(e,t)=>{const n=e.__vccOpts||e;for(const[l,r]of t)n[l]=r;return n};const z={},K={class:"header"},B=i("h1",{class:"header__h1"},"\u041E\u0442\u0447\u0435\u0442\u044B",-1),J=[B];function G(e,t){return c(),d("header",K,J)}var H=g(z,[["render",G]]);const v=e=>{let t,n,l;return t=e.getDate(),t<10&&(t="0"+t),n=e.getMonth()+1,n<10&&(n="0"+n),l=e.getFullYear(),t+"."+n+"."+l},L=e=>{let t,n,l;return t=Math.floor(e/3600),n=Math.floor(e/60)-t*60,l=e%60,[t.toString().padStart(2,"0"),n.toString().padStart(2,"0"),l.toString().padStart(2,"0")].join(":")},q=()=>{const e=new Date;return[e,e]},x=()=>{const e=new Date;let t=new Date(e-(e.getDay()-1)*864e5),n=new Date(e-(e.getDay()-1)*864e5+6*864e5);return[t,n]},Q=()=>{const e=new Date;let t=new Date(e.getFullYear(),e.getMonth(),1),n=new Date(e.getFullYear(),e.getMonth()+1,0);return[t,n]},X=()=>{const e=new Date;return new Date(e.getFullYear(),e.getMonth(),1)},R=async(e,t)=>{const n=(s,o,u)=>(o.start=u,fetch(s,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(y=>y.json()));let l=[],r=0,a=null;for(;a===null||r<a;){let s=n(e,t,r);if(a===null){let o=await s;a=parseInt(o.total)}l.push(s),r+=50}return Promise.all(l)},M=async(e,t)=>fetch(e+"/task.elapseditem.getlist",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:{ID:"asc"},filter:t,select:["ID","TASK_ID","SECONDS","CREATED_DATE"],params:{NAV_PARAMS:{nPageSize:0}}})}).then(n=>n.json()).then(n=>n.result),Z=async(e,t)=>R(e+"/tasks.task.list",{order:{ID:"asc"},filter:t,select:["ID","TITLE","GROUP_ID"]}).then(n=>n.reduce((l,r)=>l.concat(r.result.tasks),[])),ee=async(e,t)=>fetch(e+"/sonet_group.get",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({ORDER:{ID:"asc"},FILTER:t})}).then(n=>n.json()).then(n=>n.result),F=async e=>fetch(e+"/user.admin.json",{method:"post",headers:{"Content-Type":"application/json"}}).then(t=>t.json()).then(t=>t.result).catch(t=>!1),N=async e=>R(e+"/user.get",{sort:"LAST_NAME",order:"asc",filter:{ACTIVE:"true"}}).then(t=>t.reduce((n,l)=>n.concat(l.result),[])),te=async(e,t)=>fetch("https://isdayoff.ru/api/getdata?year="+e+"&month="+t+"&delimeter=|&covid=1").then(n=>n.text());const se={data(){return{apiUrl:this.$store.state.weeklyApiUrl,userId:this.$store.state.weeklyUserId,start:this.$store.state.weeklyDateFrom,end:this.$store.state.weeklyDateTo,datePickerInst:!1,users:[],isUserAdmin:!1,isLoading:!1}},created(){this.getUsers()},mounted(){let e={content:"\u0414\u0435\u043D\u044C",onClick:l=>{let r=q();l.selectDate(r),l.setViewDate(r[0])}},t={content:"\u041D\u0435\u0434\u0435\u043B\u044F",onClick:l=>{let r=x();l.selectDate(r),l.setViewDate(r[0])}},n={content:"\u041C\u0435\u0441\u044F\u0446",onClick:l=>{let r=Q();l.selectDate(r),l.setViewDate(r[0])}};this.datePickerInst=new $("[name=dates]",{range:!0,multipleDatesSeparator:" - ",selectedDates:[this.start,this.end],buttons:[e,t,n],toggleSelected:!1,onSelect(l){l.date.length==2&&l.datepicker.hide()}})},watch:{apiUrl(){this.setUserId(),this.getUsers()},users(){this.isLoading=!1}},methods:{async getUsers(){this.apiUrl&&(this.isLoading=!0,this.isUserAdmin=await F(this.apiUrl),this.isUserAdmin?this.users=await N(this.apiUrl):this.users=[])},setSettings(){this.$store.commit("weeklyApiChange",{weeklyApiUrl:this.apiUrl}),this.$store.commit("weeklyUserChange",{weeklyUserId:this.userId}),this.$store.commit("weeklyDateChange",{weeklyDateFrom:this.datePickerInst.selectedDates[0],weeklyDateTo:this.datePickerInst.selectedDates[1]||this.datePickerInst.selectedDates[0]})},setUserId(){if(this.apiUrl){let e=!1;(e=this.apiUrl.match(/rest\/(\d+)/))&&(this.userId=e[1]||!1)}else this.userId=!1}}},S=e=>(A("data-v-32878a61"),e=e(),C(),e),re={class:"settings__items"},ae=S(()=>i("label",{class:"settings__label"},"\u0421\u0442\u0440\u043E\u043A\u0430 API",-1)),ne={key:0,class:"settings__item"},le=S(()=>i("label",{class:"settings__label"},"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",-1)),ie=["value"],oe=S(()=>i("div",{class:"settings__item"},[i("label",{class:"settings__label"},"\u041F\u0435\u0440\u0438\u043E\u0434"),i("input",{class:"settings__input",type:"text",name:"dates"})],-1)),ce={class:"settings__item"};function de(e,t,n,l,r,a){return c(),d("div",{class:h(["settings",{"is-loading":r.isLoading}])},[i("div",re,[i("div",{class:h(["settings__item",{"settings__item--2":!r.isUserAdmin}])},[ae,f(i("input",{class:"settings__input",type:"text","onUpdate:modelValue":t[0]||(t[0]=s=>r.apiUrl=s)},null,512),[[U,r.apiUrl]])],2),r.isUserAdmin?(c(),d("div",ne,[le,f(i("select",{class:"settings__input","onUpdate:modelValue":t[1]||(t[1]=s=>r.userId=s)},[(c(!0),d(p,null,m(r.users,s=>(c(),d("option",{key:s.ID,value:s.ID},_(s.LAST_NAME)+" "+_(s.NAME)+" ("+_(s.ID)+") ",9,ie))),128))],512),[[b,r.userId]])])):I("",!0),oe,i("div",ce,[i("button",{class:"settings__btn",onClick:t[2]||(t[2]=(...s)=>a.setSettings&&a.setSettings(...s))},"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C")])])],2)}var _e=g(se,[["render",de],["__scopeId","data-v-32878a61"]]);const ue={data(){return{result:[],isLoading:!1}},computed:{settings(){return{apiUrl:this.$store.state.weeklyApiUrl,userId:this.$store.state.weeklyUserId,dateFrom:this.$store.state.weeklyDateFrom,dateTo:this.$store.state.weeklyDateTo}},summChecked(){return this.result.reduce((e,t)=>e+=t.selected?t.seconds:0,0)},summTotal(){return this.result.reduce((e,t)=>e+=t.seconds,0)}},created(){this.getResult()},watch:{settings(){this.getResult()},result(){this.isLoading=!1}},methods:{formatDate:v,formatTime:L,async getResult(){if(!this.settings.apiUrl||!this.settings.userId)return!1;this.isLoading=!0;const[e,t,n]=await this.getResultData();let l={0:{id:0,name:"\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0433\u0440\u0443\u043F\u043F\u0435",seconds:0,selected:this.result[0]?this.result[0].selected:!1,tasks:{0:{id:0,name:"\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0437\u0430\u0434\u0430\u0447\u0435 \u0438\u043B\u0438 \u0437\u0430\u0434\u0430\u0447\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0430",seconds:0}}}};n.forEach(a=>{l[a.ID]={id:a.ID,name:a.NAME,seconds:0,selected:this.result[a.ID]?this.result[a.ID].selected:!1,tasks:{}}});let r={0:0};t.forEach(a=>{let s=l[a.groupId],o=s?s.id:0;r[a.id]=o,l[o].tasks[a.id]={id:a.id,name:a.title,seconds:0}}),e.forEach(a=>{let s=l[r[a.TASK_ID]],o=s?s.id:0,u=l[o].tasks[a.TASK_ID],y=u?u.id:0;l[o].seconds+=parseInt(a.SECONDS),l[o].tasks[y].seconds+=parseInt(a.SECONDS)}),this.result=Object.values(l).filter(a=>(a.tasks=Object.values(a.tasks).filter(s=>s.seconds),a.seconds))},async getResultData(){let e=[],t={USER_ID:this.settings.userId,">=CREATED_DATE":v(this.settings.dateFrom)+" 00:00:00","<=CREATED_DATE":v(this.settings.dateTo)+" 23:59:59"};t.USER_ID&&(e=await M(this.settings.apiUrl,t));let n=[];t={ID:e.map(r=>r.TASK_ID)},t.ID.length&&(n=await Z(this.settings.apiUrl,t));let l=[];return t={ID:n.map(r=>r.groupId)},t.ID.length&&(l=await ee(this.settings.apiUrl,t)),[e,n,l]}}},ye=i("svg",{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30"},[i("path",{d:"M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"})],-1),he=[ye],ge={key:0,class:"weekly__items"},pe={class:"weekly__label"},me=["onUpdate:modelValue"],fe={class:"weekly__tasks"},ke={key:1,class:"weekly__footer"},De={class:"weekly__checked"},Ie={class:"weekly__total"},we={key:2,class:"weekly__empty"};function ve(e,t,n,l,r,a){return c(),d("div",{class:h(["weekly",{"is-loading":r.isLoading}])},[i("div",{class:"weekly__refresh",onClick:t[0]||(t[0]=(...s)=>a.getResult&&a.getResult(...s)),title:"\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435"},he),r.result.length?(c(),d("div",ge,[(c(!0),d(p,null,m(r.result,s=>(c(),d("div",{class:"weekly__item",key:s.id},[i("label",pe,[f(i("input",{class:"weekly__checkbox",type:"checkbox",value:"group.id","onUpdate:modelValue":o=>s.selected=o},null,8,me),[[O,s.selected]]),i("b",null,_(s.name),1),E(" ("+_(a.formatTime(s.seconds))+") ",1)]),i("div",fe,[(c(!0),d(p,null,m(s.tasks,o=>(c(),d("div",{class:"weekly__task",key:o.id},_(o.id)+" - "+_(o.name)+" ("+_(a.formatTime(o.seconds))+") ",1))),128))])]))),128))])):I("",!0),r.result.length?(c(),d("div",ke,[i("div",De,"\u0421\u0443\u043C\u043C\u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0445: "+_(a.formatTime(a.summChecked)),1),i("div",Ie,"\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u0442\u0440\u0430\u0447\u0435\u043D\u043E: "+_(a.formatTime(a.summTotal)),1)])):I("",!0),r.result.length?I("",!0):(c(),d("div",we,"\u0414\u0430\u043D\u043D\u044B\u0445 \u043D\u0435\u0442"))],2)}var Ue=g(ue,[["render",ve]]);const Ae={components:{SettingsWeekly:_e,Weekly:Ue}};function Ce(e,t,n,l,r,a){const s=k("SettingsWeekly"),o=k("Weekly");return c(),d("div",null,[D(s),D(o)])}var Se=g(Ae,[["render",Ce]]);const Te={data(){return{apiUrl:this.$store.state.yearlyApiUrl,userId:this.$store.state.yearlyUserId,date:this.$store.state.yearlyDate,datePickerInst:!1,users:[],isUserAdmin:!1,isLoading:!1}},created(){this.getUsers()},mounted(){this.datePickerInst=new $("[name=year]",{view:"years",minView:"years",dateFormat:"yyyy",range:!1,selectedDates:this.date,toggleSelected:!1,onSelect(e){e.datepicker.hide()}})},watch:{apiUrl(){this.setUserId(),this.getUsers()},users(){this.isLoading=!1}},methods:{async getUsers(){this.apiUrl&&(this.isLoading=!0,this.isUserAdmin=await F(this.apiUrl),this.isUserAdmin?this.users=await N(this.apiUrl):this.users=[])},setSettings(){this.$store.commit("yearlyApiChange",{yearlyApiUrl:this.apiUrl}),this.$store.commit("yearlyUserChange",{yearlyUserId:this.userId}),this.$store.commit("yearlyDateChange",{yearlyDate:this.datePickerInst.selectedDates[0]})},setUserId(){if(this.apiUrl){let e=!1;(e=this.apiUrl.match(/rest\/(\d+)/))&&(this.userId=e[1]||!1)}else this.userId=!1}}},T=e=>(A("data-v-468e63aa"),e=e(),C(),e),$e={class:"settings__items"},be=T(()=>i("label",{class:"settings__label"},"\u0421\u0442\u0440\u043E\u043A\u0430 API",-1)),Ee={key:0,class:"settings__item"},Le=T(()=>i("label",{class:"settings__label"},"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",-1)),xe=["value"],Re=T(()=>i("div",{class:"settings__item"},[i("label",{class:"settings__label"},"\u041F\u0435\u0440\u0438\u043E\u0434"),i("input",{class:"settings__input",type:"text",name:"year"})],-1)),Me={class:"settings__item"};function Fe(e,t,n,l,r,a){return c(),d("div",{class:h(["settings",{"is-loading":r.isLoading}])},[i("div",$e,[i("div",{class:h(["settings__item",{"settings__item--2":!r.isUserAdmin}])},[be,f(i("input",{class:"settings__input",type:"text","onUpdate:modelValue":t[0]||(t[0]=s=>r.apiUrl=s)},null,512),[[U,r.apiUrl]])],2),r.isUserAdmin?(c(),d("div",Ee,[Le,f(i("select",{class:"settings__input","onUpdate:modelValue":t[1]||(t[1]=s=>r.userId=s)},[(c(!0),d(p,null,m(r.users,s=>(c(),d("option",{key:s.ID,value:s.ID},_(s.LAST_NAME)+" "+_(s.NAME)+" ("+_(s.ID)+") ",9,xe))),128))],512),[[b,r.userId]])])):I("",!0),Re,i("div",Me,[i("button",{class:"settings__btn",onClick:t[2]||(t[2]=(...s)=>a.setSettings&&a.setSettings(...s))},"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C")])])],2)}var Ne=g(Te,[["render",Fe],["__scopeId","data-v-468e63aa"]]);const Oe={data(){return{result:[],months:["\u042F\u043D\u0432\u0430\u0440\u044C","\u0424\u0435\u0432\u0440\u0430\u043B\u044C","\u041C\u0430\u0440\u0442","\u0410\u043F\u0440\u0435\u043B\u044C","\u041C\u0430\u0439","\u0418\u044E\u043D\u044C","\u0418\u044E\u043B\u044C","\u0410\u0432\u0433\u0443\u0441\u0442","\u0421\u0435\u043D\u0442\u044F\u0431\u0440\u044C","\u041E\u043A\u0442\u044F\u0431\u0440\u044C","\u041D\u043E\u044F\u0431\u0440\u044C","\u0414\u0435\u043A\u0430\u0431\u0440\u044C"],isLoading:!1}},computed:{settings(){return{apiUrl:this.$store.state.yearlyApiUrl,userId:this.$store.state.yearlyUserId,date:this.$store.state.yearlyDate,days:this.$store.state.yearlyDays}},totalDays(){return this.result.reduce((e,t)=>e+=t.days,0)},totalTime(){return this.result.reduce((e,t)=>e+=t.seconds,0)}},mounted(){this.getResult()},watch:{settings(){this.getResult()},result(){this.isLoading=!1}},methods:{formatTime:L,async getResult(){var s,o;let e=[],t=this.settings.userId,n=this.settings.date.getFullYear(),l=this.settings.days;this.isLoading=!0,this.months.forEach((u,y)=>{e[y]={k:y,name:u,seconds:0,days:0,workDays:0,result:0}});for(const u of e){let y=await this.getMonthWorkDays(n,u.k+1);e[u.k].days=y,e[u.k].workDays=y,((o=(s=l[t])==null?void 0:s[n])==null?void 0:o[u.k])&&(e[u.k].days=l[t][n][u.k])}let r=[],a={USER_ID:t,">=CREATED_DATE":"01.01."+n+" 00:00:00","<=CREATED_DATE":"31.12."+n+" 23:59:59"};a.USER_ID&&(r=await M(this.settings.apiUrl,a)),r.forEach(u=>{let y=new Date(u.CREATED_DATE);e[y.getMonth()].seconds+=parseInt(u.SECONDS)}),this.result=e,this.daysRecalc()},daysChange(e,t){var a,s;let n=this.settings.days,l=this.settings.userId,r=this.settings.date.getFullYear();t=parseInt(t),((s=(a=n[l])==null?void 0:a[r])==null?void 0:s[e])!=t&&(n[l]||(n[l]={}),n[l][r]||(n[l][r]={}),t?n[l][r][e]=t:(delete n[l][r][e],this.result[e].days=this.result[e].workDays),this.$store.commit("yearlyDaysChange",{yearlyDays:n}),this.daysRecalc())},daysRecalc(){this.result=this.result.map(e=>(e.seconds&&e.days&&(e.result=parseFloat(e.seconds)/60/60/parseFloat(String(e.days).replace(",",".")),e.result=(Math.ceil(e.result*10)/10).toFixed(1)),e))},async getMonthWorkDays(e,t){let n=0;return n=(await te(e,t)).split("|").reduce((r,a)=>a!=1?++r:r,0),n}}},w=e=>(A("data-v-42e5a21c"),e=e(),C(),e),Ve=w(()=>i("svg",{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 30 30"},[i("path",{d:"M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"})],-1)),Ye=[Ve],Pe={class:"yearly__table"},We=w(()=>i("tr",null,[i("th",null,"\u041C\u0435\u0441\u044F\u0446"),i("th",null,"\u0412\u0440\u0435\u043C\u044F"),i("th",null,"\u0420\u0430\u0431\u043E\u0447\u0438\u0435 \u0434\u043D\u0438*"),i("th",null,"\u0412\u044B\u0440\u0430\u0431\u043E\u0442\u043A\u0430")],-1)),je={class:"is-name"},ze={class:"is-seconds"},Ke={class:"is-days"},Be=["onUpdate:modelValue","title","onKeyup","onChange"],Je={class:"is-result"},Ge=w(()=>i("td",null,null,-1)),He={class:"is-total-days"},qe=["value"],Qe=w(()=>i("td",null,null,-1)),Xe=w(()=>i("div",{class:"yearly__notes"},[i("b",null,"*"),E(" - \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C, \u043D\u0435 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u043E\u0442\u043F\u0443\u0441\u043A\u0430 \u0438 \u043E\u0442\u0433\u0443\u043B\u044B")],-1));function Ze(e,t,n,l,r,a){return c(),d("div",{class:h(["yearly",{"is-loading":r.isLoading}])},[i("div",{class:"yearly__refresh",onClick:t[0]||(t[0]=(...s)=>a.getResult&&a.getResult(...s)),title:"\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435"},Ye),i("table",Pe,[We,(c(!0),d(p,null,m(r.result,s=>(c(),d("tr",{key:s.k},[i("td",je,_(s.name),1),i("td",ze,_(a.formatTime(s.seconds)),1),i("td",Ke,[f(i("input",{class:h({"is-custom":s.days!=s.workDays}),type:"number","onUpdate:modelValue":o=>s.days=o,title:"\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E: "+s.workDays,onKeyup:o=>a.daysChange(s.k,s.days),onChange:o=>a.daysChange(s.k,s.days)},null,42,Be),[[U,s.days]])]),i("td",Je,_(s.result),1)]))),128)),i("tr",null,[Ge,i("td",null,_(a.formatTime(a.totalTime)),1),i("td",He,[i("input",{type:"number",value:a.totalDays,disabled:""},null,8,qe)]),Qe])]),Xe],2)}var et=g(Oe,[["render",Ze],["__scopeId","data-v-42e5a21c"]]);const tt={components:{SettingsYearly:Ne,Yearly:et}};function st(e,t,n,l,r,a){const s=k("SettingsYearly"),o=k("Yearly");return c(),d("div",null,[D(s),D(o)])}var rt=g(tt,[["render",st]]);const at={components:{TabWeekly:Se,TabYearly:rt},data(){return{active:0,tabs:[{k:0,name:"\u041D\u0435\u0434\u0435\u043B\u044C\u043A\u0430",content:"TabWeekly"},{k:1,name:"\u0413\u043E\u0434\u0438\u043A",content:"TabYearly"}]}},methods:{changeTab(e){this.active=e}}},nt={class:"tabs"},lt={class:"tabs__tabs"},it=["onClick"],ot={class:"tabs__contents"},ct=["onClick"];function dt(e,t,n,l,r,a){return c(),d("div",nt,[i("div",lt,[(c(!0),d(p,null,m(r.tabs,s=>(c(),d("div",{key:s.k,class:h(["tabs__tab",{"is-active":s.k==r.active}]),onClick:o=>a.changeTab(s.k)},_(s.name),11,it))),128))]),i("div",ot,[(c(!0),d(p,null,m(r.tabs,s=>(c(),d("div",{key:s.k,class:h(["tabs__content",{"is-active":s.k==r.active}]),onClick:o=>a.changeTab(s.k)},[(c(),V(Y(s.content)))],10,ct))),128))])])}var _t=g(at,[["render",dt],["__scopeId","data-v-259911e2"]]);const ut={name:"App",components:{Header:H,Tabs:_t}},yt={class:"reports"};function ht(e,t,n,l,r,a){const s=k("Header"),o=k("Tabs");return c(),d("div",yt,[D(s),D(o)])}var gt=g(ut,[["render",ht]]);const[pt,mt]=x(),ft=X();var kt=P({state(){return{weeklyApiUrl:localStorage.getItem("weeklyApiUrl")||"",weeklyUserId:localStorage.getItem("weeklyUserId")||"",weeklyDateFrom:pt,weeklyDateTo:mt,yearlyApiUrl:localStorage.getItem("yearlyApiUrl")||"",yearlyUserId:localStorage.getItem("yearlyUserId")||"",yearlyDate:ft,yearlyDays:JSON.parse(localStorage.getItem("yearlyDays"))||{}}},mutations:{weeklyApiChange(e,t){e.weeklyApiUrl=t.weeklyApiUrl,localStorage.setItem("weeklyApiUrl",t.weeklyApiUrl)},weeklyUserChange(e,t){e.weeklyUserId=t.weeklyUserId,localStorage.setItem("weeklyUserId",t.weeklyUserId)},weeklyDateChange(e,t){e.weeklyDateFrom=t.weeklyDateFrom,e.weeklyDateTo=t.weeklyDateTo},yearlyApiChange(e,t){e.yearlyApiUrl=t.yearlyApiUrl,localStorage.setItem("yearlyApiUrl",t.yearlyApiUrl)},yearlyUserChange(e,t){e.yearlyUserId=t.yearlyUserId,localStorage.setItem("yearlyUserId",t.yearlyUserId)},yearlyDateChange(e,t){e.yearlyDate=t.yearlyDate,localStorage.setItem("yearlyDate",t.yearlyDate)},yearlyDaysChange(e,t){e.yearlyDays=t.yearlyDays,localStorage.setItem("yearlyDays",JSON.stringify(t.yearlyDays))}}});W(gt).use(kt).mount("#app");