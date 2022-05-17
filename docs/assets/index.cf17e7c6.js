import{o as d,c,a as l,A as U,n as k,w as D,v as C,b as $,F as v,r as y,d as m,t as _,e as g,f as w,g as E,h as p,i as b,j as L}from"./vendor.82046901.js";const x=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}};x();var h=(t,e)=>{const n=t.__vccOpts||t;for(const[a,s]of e)n[a]=s;return n};const F={},N={class:"header"},M=l("h1",{class:"header__h1"},'\u041E\u0442\u0447\u0435\u0442 "\u041D\u0435\u0434\u0435\u043B\u044C\u043A\u0430"',-1),R=[M];function O(t,e){return d(),c("header",N,R)}var j=h(F,[["render",O]]);const I=t=>{let e,n,a;return e=t.getDate(),e<10&&(e="0"+e),n=t.getMonth()+1,n<10&&(n="0"+n),a=t.getFullYear(),e+"."+n+"."+a},T=t=>{let e,n,a;return e=Math.floor(t/3600),n=Math.floor(t/60)-e*60,a=t%60,[e.toString().padStart(2,"0"),n.toString().padStart(2,"0"),a.toString().padStart(2,"0")].join(":")},V=()=>{const t=new Date;return[t,t]},S=()=>{const t=new Date;let e=new Date(t-(t.getDay()-1)*864e5),n=new Date(t-(t.getDay()-1)*864e5+6*864e5);return[e,n]},P=()=>{const t=new Date;let e=new Date(t.getFullYear(),t.getMonth(),1),n=new Date(t.getFullYear(),t.getMonth()+1,0);return[e,n]},A=async(t,e)=>{const n=(i,o,u)=>(o.start=u,fetch(i,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(f=>f.json()));let a=[],s=0,r=null;for(;r===null||s<r;){let i=n(t,e,s);if(r===null){let o=await i;r=parseInt(o.total)}a.push(i),s+=50}return Promise.all(a)},G=async(t,e)=>fetch(t+"/task.elapseditem.getlist",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:{ID:"asc"},filter:e,select:["ID","TASK_ID","SECONDS"],params:{NAV_PARAMS:{nPageSize:0}}})}).then(n=>n.json()).then(n=>n.result),K=async(t,e)=>A(t+"/tasks.task.list",{order:{ID:"asc"},filter:e,select:["ID","TITLE","GROUP_ID"]}).then(n=>n.reduce((a,s)=>a.concat(s.result.tasks),[])),H=async(t,e)=>fetch(t+"/sonet_group.get",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({ORDER:{ID:"asc"},FILTER:e})}).then(n=>n.json()).then(n=>n.result),z=async t=>fetch(t+"/user.admin.json",{method:"post",headers:{"Content-Type":"application/json"}}).then(e=>e.json()).then(e=>e.result).catch(e=>!1),B=async t=>A(t+"/user.get",{sort:"LAST_NAME",order:"asc",filter:{ACTIVE:"true"}}).then(e=>e.reduce((n,a)=>n.concat(a.result),[]));const J={data(){return{apiUrl:this.$store.state.apiUrl,userId:this.$store.state.userId,start:this.$store.state.dateFrom,end:this.$store.state.dateTo,datePickerInst:!1,users:[],isAdmin:!1}},created(){this.getUsers()},mounted(){let t={content:"\u0414\u0435\u043D\u044C",onClick:a=>{let s=V();a.selectDate(s),a.setViewDate(s[0])}},e={content:"\u041D\u0435\u0434\u0435\u043B\u044F",onClick:a=>{let s=S();a.selectDate(s),a.setViewDate(s[0])}},n={content:"\u041C\u0435\u0441\u044F\u0446",onClick:a=>{let s=P();a.selectDate(s),a.setViewDate(s[0])}};this.datePickerInst=new U("[name=dates]",{range:!0,multipleDatesSeparator:" - ",selectedDates:[this.start,this.end],buttons:[t,e,n],toggleSelected:!1,onSelect(a){a.date.length==2&&a.datepicker.hide()}})},watch:{apiUrl(){this.setUserId(),this.getUsers()},users(){this.setLoadingEnd()}},methods:{async getUsers(){this.apiUrl&&(this.setLoadingStart(),this.isAdmin=await z(this.apiUrl),this.isAdmin?this.users=await B(this.apiUrl):this.users=[])},setSettings(){this.$store.commit("apiChange",{apiUrl:this.apiUrl}),this.$store.commit("userChange",{userId:this.userId}),this.$store.commit("dateChange",{dateFrom:this.datePickerInst.selectedDates[0],dateTo:this.datePickerInst.selectedDates[1]||this.datePickerInst.selectedDates[0]})},setUserId(){if(this.apiUrl){let t=!1;(t=this.apiUrl.match(/rest\/(\d+)/))&&(this.userId=t[1]||!1)}else this.userId=!1},setLoadingStart(){this.$store.commit("loadingChange",{isLoading:!0})},setLoadingEnd(){this.$store.commit("loadingChange",{isLoading:!1})}}},Y={class:"settings"},W={class:"settings__items"},q=l("label",{class:"settings__label"},"\u0421\u0442\u0440\u043E\u043A\u0430 API",-1),Q={key:0,class:"settings__item"},X=l("label",{class:"settings__label"},"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",-1),Z=["value"],ee=l("div",{class:"settings__item"},[l("label",{class:"settings__label"},"\u041F\u0435\u0440\u0438\u043E\u0434"),l("input",{class:"settings__input",type:"text",name:"dates"})],-1),te={class:"settings__item"};function se(t,e,n,a,s,r){return d(),c("div",Y,[l("div",W,[l("div",{class:k(["settings__item",{"settings__item--2":!s.isAdmin}])},[q,D(l("input",{class:"settings__input",type:"text","onUpdate:modelValue":e[0]||(e[0]=i=>s.apiUrl=i)},null,512),[[C,s.apiUrl]])],2),s.isAdmin?(d(),c("div",Q,[X,D(l("select",{class:"settings__input","onUpdate:modelValue":e[1]||(e[1]=i=>s.userId=i)},[(d(!0),c(v,null,y(s.users,i=>(d(),c("option",{key:i.ID,value:i.ID},_(i.LAST_NAME)+" "+_(i.NAME)+" ("+_(i.ID)+") ",9,Z))),128))],512),[[$,s.userId]])])):m("",!0),ee,l("div",te,[l("button",{class:"settings__btn",onClick:e[2]||(e[2]=(...i)=>r.setSettings&&r.setSettings(...i))},"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C")])])])}var re=h(J,[["render",se]]);const ne={props:["fields"],methods:{formatTime:T}},ae={class:"task"};function ie(t,e,n,a,s,r){return d(),c("div",ae,_(n.fields.id)+" - "+_(n.fields.name)+" ("+_(r.formatTime(n.fields.seconds))+") ",1)}var oe=h(ne,[["render",ie]]);const le={components:{TaskItem:oe},data(){return{result:[]}},computed:{settings(){return{apiUrl:this.$store.state.apiUrl,userId:this.$store.state.userId,dateFrom:this.$store.state.dateFrom,dateTo:this.$store.state.dateTo}},summChecked(){return this.result.reduce((t,e)=>t+=e.selected?e.seconds:0,0)},summTotal(){return this.result.reduce((t,e)=>t+=e.seconds,0)}},created(){this.getResult()},watch:{settings(){this.getResult()},result(){this.setLoadingEnd()}},methods:{formatDate:I,formatTime:T,async getResult(){if(!this.settings.apiUrl||!this.settings.userId)return!1;this.setLoadingStart();const[t,e,n]=await this.getResultData();let a={0:{id:0,name:"\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0433\u0440\u0443\u043F\u043F\u0435",seconds:0,selected:this.result[0]?this.result[0].selected:!1,tasks:{0:{id:0,name:"\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0437\u0430\u0434\u0430\u0447\u0435 \u0438\u043B\u0438 \u0437\u0430\u0434\u0430\u0447\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0430",seconds:0}}}};n.forEach(r=>{a[r.ID]={id:r.ID,name:r.NAME,seconds:0,selected:this.result[r.ID]?this.result[r.ID].selected:!1,tasks:{}}});let s={0:0};e.forEach(r=>{let i=a[r.groupId],o=i?i.id:0;s[r.id]=o,a[o].tasks[r.id]={id:r.id,name:r.title,seconds:0}}),t.forEach(r=>{let i=a[s[r.TASK_ID]],o=i?i.id:0,u=a[o].tasks[r.TASK_ID],f=u?u.id:0;a[o].seconds+=parseInt(r.SECONDS),a[o].tasks[f].seconds+=parseInt(r.SECONDS)}),this.result=Object.values(a).filter(r=>(r.tasks=Object.values(r.tasks).filter(i=>i.seconds),r.seconds))},async getResultData(){let t=[],e={USER_ID:this.$store.state.userId,">=CREATED_DATE":I(this.$store.state.dateFrom)+" 00:00:00","<=CREATED_DATE":I(this.$store.state.dateTo)+" 23:59:59"};e.USER_ID&&(t=await G(this.$store.state.apiUrl,e));let n=[];e={ID:t.map(s=>s.TASK_ID)},e.ID.length&&(n=await K(this.$store.state.apiUrl,e));let a=[];return e={ID:n.map(s=>s.groupId)},e.ID.length&&(a=await H(this.$store.state.apiUrl,e)),[t,n,a]},setLoadingStart(){this.$store.commit("loadingChange",{isLoading:!0})},setLoadingEnd(){this.$store.commit("loadingChange",{isLoading:!1})}}},de={class:"groups"},ce={key:0,class:"groups__items"},ue={class:"groups__label"},_e=["onUpdate:modelValue"],he={class:"groups__tasks"},me={key:1,class:"groups__footer"},ge={class:"groups__checked"},pe={class:"groups__total"},fe={key:2,class:"groups__empty"};function Ie(t,e,n,a,s,r){const i=g("TaskItem");return d(),c("div",de,[l("div",{class:"groups__refresh",onClick:e[0]||(e[0]=(...o)=>r.getResult&&r.getResult(...o))},"\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435"),s.result.length?(d(),c("div",ce,[(d(!0),c(v,null,y(s.result,o=>(d(),c("div",{class:"groups__item",key:o.id},[l("label",ue,[D(l("input",{class:"groups__checkbox",type:"checkbox",value:"group.id","onUpdate:modelValue":u=>o.selected=u},null,8,_e),[[w,o.selected]]),l("b",null,_(o.name),1),E(" ("+_(r.formatTime(o.seconds))+") ",1)]),l("div",he,[(d(!0),c(v,null,y(o.tasks,u=>(d(),c("div",{class:"groups__task",key:u.id},[p(i,{fields:u},null,8,["fields"])]))),128))])]))),128))])):m("",!0),s.result.length?(d(),c("div",me,[l("div",ge,"\u0421\u0443\u043C\u043C\u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0445: "+_(r.formatTime(r.summChecked)),1),l("div",pe,"\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u0442\u0440\u0430\u0447\u0435\u043D\u043E: "+_(r.formatTime(r.summTotal)),1)])):m("",!0),s.result.length?m("",!0):(d(),c("div",fe,"\u0414\u0430\u043D\u043D\u044B\u0445 \u043D\u0435\u0442"))])}var De=h(le,[["render",Ie]]);const ve={name:"App",components:{Header:j,Settings:re,Groups:De}};function ye(t,e,n,a,s,r){const i=g("Header"),o=g("Settings"),u=g("Groups");return d(),c("div",{class:k(["weekly",{"is-loading":this.$store.state.isLoading}])},[p(i),p(o),p(u)],2)}var ke=h(ve,[["render",ye]]);const[Te,Se]=S();var Ae=b({state(){return{apiUrl:localStorage.getItem("apiUrl")||"",userId:localStorage.getItem("userId")||"",dateFrom:Te,dateTo:Se,isLoading:!1}},mutations:{apiChange(t,e){t.apiUrl=e.apiUrl,localStorage.setItem("apiUrl",e.apiUrl)},userChange(t,e){t.userId=e.userId,localStorage.setItem("userId",e.userId)},dateChange(t,e){t.dateFrom=e.dateFrom,t.dateTo=e.dateTo},loadingChange(t,e){t.isLoading=e.isLoading}}});L(ke).use(Ae).mount("#app");