"use strict";(self.webpackChunkproyecto_web1_backend=self.webpackChunkproyecto_web1_backend||[]).push([[5146],{85146(I,D,_){_.r(D),_.d(D,{LoginEE:()=>T});var E=_(92132),a=_(94061),O=_(48653),P=_(83997),M=_(30893),l=_(54894),i=_(47610),n=_(82688),d=_(77452),L=_(55506),r=_(15126),o=_(63299),h=_(2595),s=_(74391),A=_(61894),C=_(14718),t=_(21272),K=_(82437),m=_(61535),g=_(71601),x=_(12083),j=_(48258),y=_(96854),f=_(74930),c=_(20743),S=_(91011),$=_(67131),N=_(76659),F=_(96495),z=_(93679),G=_(47734),Q=_(36986),X=_(89791),Y=_(2712),Z=_(67289),H=_(32869),J=_(65740),V=_(57646),u=_(23120),p=_(44414),e=_(25962),w=_(14664),k=_(42588),b=_(90325),q=_(62785),__=_(87443),E_=_(41032),s_=_(22957),t_=_(93179),a_=_(73055),O_=_(15747),n_=_(90991),D_=_(26509),P_=_(39351),M_=_(83006),d_=_(75530);const B=(0,i.Ay)(O.c)`
  flex: 1;
`,T=R=>{const{formatMessage:U}=(0,l.A)(),{isLoading:W,data:v=[]}=(0,n.g)(void 0,{skip:!window.strapi.features.isEnabled(window.strapi.features.SSO)});return!window.strapi.features.isEnabled(window.strapi.features.SSO)||!W&&v.length===0?(0,E.jsx)(n.L,{...R}):(0,E.jsx)(n.L,{...R,children:(0,E.jsx)(a.a,{paddingTop:7,children:(0,E.jsxs)(P.s,{direction:"column",alignItems:"stretch",gap:7,children:[(0,E.jsxs)(P.s,{children:[(0,E.jsx)(B,{}),(0,E.jsx)(a.a,{paddingLeft:3,paddingRight:3,children:(0,E.jsx)(M.o,{variant:"sigma",textColor:"neutral600",children:U({id:"Auth.login.sso.divider"})})}),(0,E.jsx)(B,{})]}),(0,E.jsx)(d.S,{providers:v,displayAllProviders:!1})]})})})}},77452(I,D,_){_.d(D,{S:()=>L});var E=_(92132),a=_(90151),O=_(68074),P=_(83997),M=_(79739),l=_(30893),i=_(54894),n=_(71389),d=_(47610);const L=({providers:s,displayAllProviders:A})=>{const{formatMessage:C}=(0,i.A)();return A?(0,E.jsx)(a.x,{gap:4,children:s.map(t=>(0,E.jsx)(O.E,{col:4,children:(0,E.jsx)(o,{provider:t})},t.uid))}):s.length>2&&!A?(0,E.jsxs)(a.x,{gap:4,children:[s.slice(0,2).map(t=>(0,E.jsx)(O.E,{col:4,children:(0,E.jsx)(o,{provider:t})},t.uid)),(0,E.jsx)(O.E,{col:4,children:(0,E.jsx)(M.m,{label:C({id:"global.see-more"}),children:(0,E.jsx)(h,{as:n.N_,to:"/auth/providers",children:(0,E.jsx)("span",{"aria-hidden":!0,children:"\u2022\u2022\u2022"})})})})]}):(0,E.jsx)(r,{justifyContent:"center",children:s.map(t=>(0,E.jsx)(o,{provider:t},t.uid))})},r=(0,d.Ay)(P.s)`
  & a:not(:first-child):not(:last-child) {
    margin: 0 ${({theme:s})=>s.spaces[2]};
  }
  & a:first-child {
    margin-right: ${({theme:s})=>s.spaces[2]};
  }
  & a:last-child {
    margin-left: ${({theme:s})=>s.spaces[2]};
  }
`,o=({provider:s})=>(0,E.jsx)(M.m,{label:s.displayName,children:(0,E.jsx)(h,{href:`${window.strapi.backendURL}/admin/connect/${s.uid}`,children:s.icon?(0,E.jsx)("img",{src:s.icon,"aria-hidden":!0,alt:"",height:"32px"}):(0,E.jsx)(l.o,{children:s.displayName})})}),h=d.Ay.a`
  width: ${136/16}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${48/16}rem;
  border: 1px solid ${({theme:s})=>s.colors.neutral150};
  border-radius: ${({theme:s})=>s.borderRadius};
  text-decoration: inherit;
  &:link {
    text-decoration: none;
  }
  color: ${({theme:s})=>s.colors.neutral600};
`}}]);
