(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{1814:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var helpers_extends=__webpack_require__(11),extends_default=__webpack_require__.n(helpers_extends),slicedToArray=__webpack_require__(37),slicedToArray_default=__webpack_require__.n(slicedToArray),defineProperty=__webpack_require__(6),defineProperty_default=__webpack_require__.n(defineProperty),styled_jsx_style=__webpack_require__(1),style_default=__webpack_require__.n(styled_jsx_style),react=__webpack_require__(0),react_default=__webpack_require__.n(react),reach_dialog_esm=__webpack_require__(502),classnames=__webpack_require__(13),classnames_default=__webpack_require__.n(classnames),get=__webpack_require__(121),get_default=__webpack_require__.n(get),react_spring_esm=__webpack_require__(300),reactusegesture_esm=__webpack_require__(1954),useResponsive=__webpack_require__(398),useOutsideClick=__webpack_require__(1850),keyCodes=__webpack_require__(501),dom=__webpack_require__(1846),objectWithoutProperties=__webpack_require__(15),objectWithoutProperties_default=__webpack_require__.n(objectWithoutProperties),enums_text=__webpack_require__(143),_defaultExport=[".overlay.jsx-2754959688{position:absolute;top:0;right:0;bottom:0;left:0;content:'';background:rgba(0,0,0,0.25);will-change:opacity;}",".container.jsx-2754959688{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;max-height:80vh;max-height:calc(var(--vh)*90);background:#fff;border-radius:0.5rem 0.5rem 0 0;will-change:transform,top;}",".container.jsx-2754959688::before{position:absolute;top:100%;right:0;left:0;height:300vh;content:'';background:#fff;}",".container.fixed-height.jsx-2754959688{height:80vh;height:calc(var(--vh)*90);}","@media (min-width:768px){.container.jsx-2754959688{border-radius:0.5rem;will-change:opacity;}.container.jsx-2754959688::before{display:none;}.container.no-header.jsx-2754959688{padding-top:0;}.container.fixed-height.jsx-2754959688{height:auto;}}",".container.sm.jsx-2754959688{grid-column:1 / -1;}","@media (min-width:768px){.container.sm.jsx-2754959688{grid-column:col-start 3 / span 4;}}","@media (min-width:1024px){.container.sm.jsx-2754959688{grid-column:col-start 3 / span 5;}}","@media (min-width:1280px){.container.sm.jsx-2754959688{grid-column:col-start 5 / span 4;}}",".container.lg.jsx-2754959688{grid-column:1 / -1;}","@media (min-width:768px){.container.lg.jsx-2754959688{grid-column:col-start 2 / span 6;}}","@media (min-width:1024px){.container.lg.jsx-2754959688{grid-column:col-start 3 / span 5;}}","@media (min-width:1280px){.container.lg.jsx-2754959688{grid-column:col-start 4 / span 6;}}",".handle.jsx-2754959688{position:absolute;top:0;left:50%;padding:0.5rem;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);}",".handle.jsx-2754959688 .icon.jsx-2754959688{display:inline-block;width:3rem;height:0.375rem;background:#f7f7f7;border-radius:0.5rem;}"];_defaultExport.__hash="2754959688";var styles=_defaultExport,__jsx=react_default.a.createElement,Handle_Handle=function Handle(_ref){var closeDialog=_ref.closeDialog,props=objectWithoutProperties_default()(_ref,["closeDialog"]);return __jsx("button",extends_default()({type:"button","aria-label":enums_text.b.zh_hant.close,onClick:closeDialog},props,{className:"jsx-".concat(styles.__hash)+" "+(props&&null!=props.className&&props.className||"handle")}),__jsx("span",{className:"jsx-".concat(styles.__hash)+" icon"}),__jsx(style_default.a,{id:styles.__hash},styles))},Dialog_Handle=Handle_Handle;try{Handle_Handle.displayName="Handle",Handle_Handle.__docgenInfo={description:"",displayName:"Handle",props:{closeDialog:{defaultValue:null,description:"",name:"closeDialog",required:!0,type:{name:"() => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Dialog/Handle.tsx#Handle"]={docgenInfo:Handle_Handle.__docgenInfo,name:"Handle",path:"src/components/Dialog/Handle.tsx#Handle"})}catch(__react_docgen_typescript_loader_error){}var Overlay_jsx=react_default.a.createElement,Overlay_Overlay=function Overlay(props){return Overlay_jsx("div",extends_default()({"aria-hidden":!0},props,{className:"jsx-".concat(styles.__hash)+" "+(props&&null!=props.className&&props.className||"overlay")}),Overlay_jsx(style_default.a,{id:styles.__hash},styles))},Dialog_Overlay=Overlay_Overlay;try{Overlay_Overlay.displayName="Overlay",Overlay_Overlay.__docgenInfo={description:"",displayName:"Overlay",props:{style:{defaultValue:null,description:"",name:"style",required:!0,type:{name:"CSSProperties"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Dialog/Overlay.tsx#Overlay"]={docgenInfo:Overlay_Overlay.__docgenInfo,name:"Overlay",path:"src/components/Dialog/Overlay.tsx#Overlay"})}catch(__react_docgen_typescript_loader_error){}var styles_global_defaultExport=[".dialog[data-reach-dialog-overlay]{position:fixed;top:0;right:0;bottom:0;left:0;z-index:200;overflow:hidden;}","@media (min-width:768px){.dialog[data-reach-dialog-overlay]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}}",".dialog [data-reach-dialog-content]{position:absolute;right:0;bottom:0;left:0;outline:none;}","@media (min-width:768px){.dialog [data-reach-dialog-content]{position:relative;right:auto;bottom:auto;left:auto;width:100%;}}"];styles_global_defaultExport.__hash="530637901";var styles_global=styles_global_defaultExport,Dialog_jsx=react_default.a.createElement,Dialog_Container=function Container(_ref){var _ref$size=_ref.size,size=void 0===_ref$size?"lg":_ref$size,fixedHeight=_ref.fixedHeight,onDismiss=_ref.onDismiss,children=_ref.children,style=_ref.style,setDragGoal=_ref.setDragGoal,isSmallUp=Object(useResponsive.a)("sm-up"),node=Object(react.useRef)(null),containerClasses=classnames_default()(defineProperty_default()({container:!0,"fixed-height":!!fixedHeight},size,!0)),closeTopDialog=function closeTopDialog(){var dialogs=Array.prototype.slice.call(dom.a.$$("[data-reach-dialog-overlay]")),topDialog=dialogs[dialogs.length-1];topDialog&&node.current&&topDialog.contains(node.current)&&onDismiss()},bind=Object(reactusegesture_esm.a)((function(_ref2){var down=_ref2.down,my=slicedToArray_default()(_ref2.movement,2)[1];!down&&my>30?onDismiss():setDragGoal({top:down?Math.max(my,-30):0})}));return Object(useOutsideClick.a)(node,closeTopDialog),Dialog_jsx("div",{className:"l-row"},Dialog_jsx("div",{ref:node,style:style,onKeyDown:function onKeyDown(event){event.keyCode===keyCodes.a.escape&&closeTopDialog()},className:"jsx-".concat(styles.__hash)+" "+(containerClasses||"")},children,!isSmallUp&&Dialog_jsx(Dialog_Handle,extends_default()({closeDialog:onDismiss},bind())),Dialog_jsx(style_default.a,{id:styles.__hash},styles)))},Dialog_Dialog=function Dialog(props){var isOpen=props.isOpen,_onRest=props.onRest,slideIn=props.slideIn,_useState=Object(react.useState)(isOpen),mounted=_useState[0],setMounted=_useState[1],isSmallUp=Object(useResponsive.a)("sm-up"),_useSpring=Object(react_spring_esm.useSpring)((function(){return{top:0}})),_useSpring2=slicedToArray_default()(_useSpring,2),top=_useSpring2[0].top,setDragGoal=_useSpring2[1],_useSpring3=Object(react_spring_esm.useSpring)((function(){return{opacity:0,transform:"translateY(100%)",config:{tension:270,friction:isSmallUp?void 0:30},onRest:function onRest(val){get_default()(val,"value.opacity")<=0&&(setMounted(!1),setDragGoal({top:0})),_onRest&&_onRest()}}})),_useSpring4=slicedToArray_default()(_useSpring3,2),_useSpring4$=_useSpring4[0],opacity=_useSpring4$.opacity,transform=_useSpring4$.transform,setFade=_useSpring4[1];Object(react.useEffect)((function(){isOpen?(setMounted(!0),setFade({opacity:1,transform:"translateY(0%)"})):setFade({opacity:0,transform:"translateY(100%)"})}));var AnimatedDialogOverlay=Object(react_spring_esm.animated)(reach_dialog_esm.b),AnimatedContainer=Object(react_spring_esm.animated)(Dialog_Container),AnimatedOverlay=Object(react_spring_esm.animated)(Dialog_Overlay);return mounted?Dialog_jsx(react_default.a.Fragment,null,Dialog_jsx(AnimatedDialogOverlay,{className:"dialog"},Dialog_jsx(AnimatedOverlay,{style:{opacity:opacity}}),Dialog_jsx(reach_dialog_esm.a,{className:"l-container full","aria-labelledby":"dialog-title"},Dialog_jsx(AnimatedContainer,extends_default()({style:{transform:!isSmallUp&&slideIn?transform:void 0,opacity:isSmallUp||!slideIn?opacity:void 0,top:isSmallUp?void 0:top},setDragGoal:setDragGoal},props)))),Dialog_jsx(style_default.a,{id:styles_global.__hash},styles_global)):null};__webpack_exports__.default=Dialog_Dialog;try{Dialog_Dialog.displayName="Dialog",Dialog_Dialog.__docgenInfo={description:"",displayName:"Dialog",props:{size:{defaultValue:{value:"lg"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"lg"'}]}},fixedHeight:{defaultValue:null,description:"",name:"fixedHeight",required:!1,type:{name:"boolean"}},slideIn:{defaultValue:null,description:"",name:"slideIn",required:!1,type:{name:"boolean"}},isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean | undefined"}},onDismiss:{defaultValue:null,description:"",name:"onDismiss",required:!0,type:{name:"() => void"}},onRest:{defaultValue:null,description:"",name:"onRest",required:!1,type:{name:"(() => void)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Dialog/Dialog.tsx#Dialog"]={docgenInfo:Dialog_Dialog.__docgenInfo,name:"Dialog",path:"src/components/Dialog/Dialog.tsx#Dialog"})}catch(__react_docgen_typescript_loader_error){}}}]);