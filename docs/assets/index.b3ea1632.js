import{o as c,c as u,a as l,A as E,w as v,v as k,t as h,r as f,b as m,F as y,d as S,e as b,f as x,g as I,n as A,h as U,i as C}from"./vendor.c5d43746.js";const O=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const e of o)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function a(o){const e={};return o.integrity&&(e.integrity=o.integrity),o.referrerpolicy&&(e.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?e.credentials="include":o.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(o){if(o.ep)return;o.ep=!0;const e=a(o);fetch(o.href,e)}};O();var g=(t,s)=>{const a=t.__vccOpts||t;for(const[i,o]of s)a[i]=o;return a};const L={name:"Header"},F={class:"header"},j=l("h1",{class:"header__h1"},'\u041E\u0442\u0447\u0435\u0442 "\u041D\u0435\u0434\u0435\u043B\u044C\u043A\u0430"',-1),N=[j];function w(t,s,a,i,o,e){return c(),u("header",F,N)}var P=g(L,[["render",w]]);const M={name:"Settings",data(){return{apiUrl:this.$store.state.apiUrl,userId:this.$store.state.userId,start:this.$store.state.dateFrom,end:this.$store.state.dateTo,datePickerInst:!1}},mounted(){this.datePickerInst=new E("[name=dates]",{range:!0,multipleDatesSeparator:" - ",selectedDates:[this.start,this.end],onSelect(t){t.date.length==2&&t.datepicker.hide()}})},methods:{setSettings(){this.$store.commit("apiChange",{apiUrl:this.apiUrl}),this.$store.commit("userChange",{userId:this.userId}),this.$store.commit("dateChange",{dateFrom:this.datePickerInst.selectedDates[0],dateTo:this.datePickerInst.selectedDates[1]})}}},R={class:"settings"},V={class:"settings__items"},G={class:"settings__item"},H=l("label",{class:"settings__label"},"\u0421\u0442\u0440\u043E\u043A\u0430 API",-1),K={class:"settings__item"},z=l("label",{class:"settings__label"},"ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",-1),B=l("div",{class:"settings__item"},[l("label",{class:"settings__label"},"\u041F\u0435\u0440\u0438\u043E\u0434"),l("input",{class:"settings__input",type:"text",name:"dates"})],-1),J={class:"settings__item"};function q(t,s,a,i,o,e){return c(),u("div",R,[l("div",V,[l("div",G,[H,v(l("input",{class:"settings__input",type:"text","onUpdate:modelValue":s[0]||(s[0]=n=>o.apiUrl=n)},null,512),[[k,o.apiUrl]])]),l("div",K,[z,v(l("input",{class:"settings__input",type:"text","onUpdate:modelValue":s[1]||(s[1]=n=>o.userId=n)},null,512),[[k,o.userId]])]),B,l("div",J,[l("button",{class:"settings__btn",onClick:s[2]||(s[2]=(...n)=>e.setSettings&&e.setSettings(...n))},"\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C")])])])}var Y=g(M,[["render",q]]);const D=t=>{let s,a,i;return s=t.getDate(),s<10&&(s="0"+s),a=t.getMonth()+1,a<10&&(a="0"+a),i=t.getFullYear(),s+"."+a+"."+i},T=t=>{let s,a,i;return s=Math.floor(t/3600),a=Math.floor(t/60)-s*60,i=t%60,[s.toString().padStart(2,"0"),a.toString().padStart(2,"0"),i.toString().padStart(2,"0")].join(":")},Q=async(t,s)=>fetch(t+"/task.elapseditem.getlist",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:{ID:"asc"},filter:s,select:["ID","TASK_ID","SECONDS"],params:{NAV_PARAMS:{nPageSize:0}}})}).then(a=>a.json()),W=async(t,s)=>{const a=(n,r,d)=>fetch(n+"/tasks.task.list",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:{ID:"asc"},filter:r,select:["ID","TITLE","GROUP_ID","TIME_ESTIMATE"],start:d})}).then(_=>_.json());let i=[],o=0,e=null;for(;e===null||o<e;){let n=a(t,s,o);if(e===null){let r=await n;e=parseInt(r.total)}i.push(n),o+=50}return Promise.all(i)},X=async(t,s)=>fetch(t+"/sonet_group.get",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({ORDER:{ID:"asc"},FILTER:s})}).then(a=>a.json());const Z={name:"TaskItem",props:["fields"],methods:{formatTime:T}},ee={class:"task"};function te(t,s,a,i,o,e){return c(),u("div",ee,h(a.fields.id)+" - "+h(a.fields.name)+" ("+h(e.formatTime(a.fields.seconds))+") ",1)}var se=g(Z,[["render",te]]);const re={name:"Tasks",components:{TaskItem:se},data(){return{result:{},resultExist:!1,isLoading:!0}},computed:{settings(){return{apiUrl:this.$store.state.apiUrl,userId:this.$store.state.userId,dateFrom:this.$store.state.dateFrom,dateTo:this.$store.state.dateTo}},checkedSumm(){let t=0;for(const[s,a]of Object.entries(this.result))a.selected===!0&&(t+=a.seconds);return t},totalSumm(){let t=0;for(const[s,a]of Object.entries(this.result))t+=a.seconds;return t}},watch:{settings:{handler(){this.getData()},deep:!0}},created(){this.getData()},methods:{formatDate:D,formatTime:T,getData(){this.setLoadingStart();let t={},s={},a={},i={};if(!this.$store.state.userId||!this.$store.state.dateFrom||!this.$store.state.dateTo)return this.setLoadingEnd(),!1;let o={USER_ID:this.$store.state.userId,">=CREATED_DATE":D(this.$store.state.dateFrom),"<=CREATED_DATE":D(this.$store.state.dateTo)};Q(this.$store.state.apiUrl,o).then(e=>{if(e!=null)return e.result}).then(e=>{if(e!=null&&e.length){let n={ID:[]};return e.forEach(r=>{n.ID[n.ID.length]=r.TASK_ID,s[r.ID]={id:r.ID,taskId:r.TASK_ID,seconds:parseFloat(r.SECONDS)}}),n.ID=n.ID.filter((r,d,_)=>_.indexOf(r)===d),W(this.$store.state.apiUrl,n)}}).then(e=>{if(e!=null){let n=[];return e.forEach(r=>{r!=null&&(n=n.concat(r.result.tasks))}),n}}).then(e=>{if(e!=null&&e.length){let n={ID:[]};return e.forEach(r=>{n.ID[n.ID.length]=r.groupId,a[r.id]={id:r.id,name:r.title,groupId:r.groupId,seconds:0}}),n.ID=n.ID.filter((r,d,_)=>_.indexOf(r)===d),X(this.$store.state.apiUrl,n)}}).then(e=>{if(e!=null)return e.result}).then(e=>{e!=null&&e.length&&e.forEach(n=>{i[n.ID]={id:n.ID,name:n.NAME,tasks:{},seconds:0,selected:this.result[n.ID]?this.result[n.ID].selected:!1}})}).then(e=>{t[0]={id:0,name:"\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0433\u0440\u0443\u043F\u043F\u0435",tasks:{},seconds:0,selected:this.result[0]?this.result[0].selected:!1};for(const[n,r]of Object.entries(i))t[r.id]=r;for(const[n,r]of Object.entries(a)){let d=t[r.groupId]?t[r.groupId].id:0;t[d].tasks[r.id]=r,a[n].groupId=d}for(const[n,r]of Object.entries(s)){let d=a[r.taskId].groupId,_=r.taskId;t[d].seconds+=r.seconds,t[d].tasks[_].seconds+=r.seconds}Object.keys(t[0].tasks).length==0&&delete t[0],this.result=t,this.resultExist=Object.keys(t).length,this.setLoadingEnd()})},setLoadingStart(){this.$store.commit("loadingChange",{isLoading:!0})},setLoadingEnd(){this.$store.commit("loadingChange",{isLoading:!1})}}},ne={class:"groups"},ae={key:1,class:"groups__items"},oe={class:"groups__label"},ie=["onUpdate:modelValue"],le={class:"groups__tasks"},de={key:2,class:"groups__footer"},ce={class:"groups__checked"},ue={class:"groups__total"},_e={key:3,class:"groups__empty"};function he(t,s,a,i,o,e){const n=f("TaskItem");return c(),u("div",ne,[o.resultExist?(c(),u("div",{key:0,class:"groups__refresh",onClick:s[0]||(s[0]=(...r)=>e.getData&&e.getData(...r))}," \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 ")):m("",!0),o.resultExist?(c(),u("div",ae,[(c(!0),u(y,null,S(o.result,r=>(c(),u("div",{class:"groups__item",key:r.id},[l("label",oe,[v(l("input",{class:"groups__checkbox",type:"checkbox",value:"group.id","onUpdate:modelValue":d=>r.selected=d},null,8,ie),[[b,r.selected]]),l("b",null,h(r.name),1),x(" ("+h(e.formatTime(r.seconds))+") ",1)]),l("div",le,[(c(!0),u(y,null,S(r.tasks,d=>(c(),u("div",{class:"groups__task",key:d.id},[I(n,{fields:d},null,8,["fields"])]))),128))])]))),128))])):m("",!0),o.resultExist?(c(),u("div",de,[l("div",ce," \u0421\u0443\u043C\u043C\u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0445: "+h(e.formatTime(e.checkedSumm)),1),l("div",ue," \u0412\u0441\u0435\u0433\u043E \u0437\u0430\u0442\u0440\u0430\u0447\u0435\u043D\u043E: "+h(e.formatTime(e.totalSumm)),1)])):m("",!0),o.resultExist?m("",!0):(c(),u("div",_e,"\u0414\u0430\u043D\u043D\u044B\u0445 \u043D\u0435\u0442"))])}var pe=g(re,[["render",he]]);const ge={name:"App",components:{Header:P,Settings:Y,Groups:pe}};function me(t,s,a,i,o,e){const n=f("Header"),r=f("Settings"),d=f("Groups");return c(),u("div",{class:A(["weekly",{"is-loading":this.$store.state.isLoading}])},[I(n),I(r),I(d)],2)}var fe=g(ge,[["render",me]]);const p=new Date;let $=new Date(p-(p.getDay()-1)*864e5),Ie=new Date(p-(p.getDay()-1)*864e5+6*864e5);$=new Date(p-3600*24*1e3*60);var De=U({state(){return{apiUrl:localStorage.getItem("apiUrl")||"",userId:localStorage.getItem("userId")||"",dateFrom:$,dateTo:Ie,isLoading:!0}},mutations:{apiChange(t,s){t.apiUrl=s.apiUrl,localStorage.setItem("apiUrl",s.apiUrl)},userChange(t,s){t.userId=s.userId,localStorage.setItem("userId",s.userId)},dateChange(t,s){t.dateFrom=s.dateFrom,t.dateTo=s.dateTo},loadingChange(t,s){t.isLoading=s.isLoading}}});C(fe).use(De).mount("#app");
