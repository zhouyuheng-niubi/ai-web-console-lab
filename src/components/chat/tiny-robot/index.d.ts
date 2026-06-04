import { AllowedComponentProps } from 'vue';
import { App } from 'vue';
import { AutoSize as AutoSize_2 } from './index.type';
import { Component } from 'vue';
import { ComponentCustomProperties } from 'vue';
import { ComponentCustomProps } from 'vue';
import { ComponentInternalInstance } from 'vue';
import { ComponentOptionsBase } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComponentPublicInstance } from 'vue';
import { CreateComponentPublicInstanceWithMixins } from 'vue';
import { CSSProperties } from 'vue';
import { DebuggerEvent } from 'vue';
import { default as default_2 } from './Bubble.vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import { GlobalComponents } from 'vue';
import { GlobalDirectives } from 'vue';
import { InputMode as InputMode_2 } from './index.type';
import { nextTick } from 'vue';
import { OnCleanup } from '@vue/reactivity';
import { Options } from 'markdown-it';
import { PropType } from 'vue';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { RendererElement } from 'vue';
import { RendererNode } from 'vue';
import { ShallowUnwrapRef } from 'vue';
import { Slot } from 'vue';
import { SubmitTrigger as SubmitTrigger_2 } from './index.type';
import { SuggestionPillItem as SuggestionPillItem_2 } from './index.type';
import { TemplateEditorProps as TemplateEditorProps_2 } from './index.type';
import { ThemeType as ThemeType_2 } from './index.type';
import { VNode } from 'vue';
import { VNodeProps } from 'vue';
import { WatchOptions } from 'vue';
import { WatchStopHandle } from 'vue';

declare const __VLS_component: DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
"update:show": (value: boolean) => any;
"update:fullscreen": (value: boolean | undefined) => any;
}, string, PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
"onUpdate:show"?: ((value: boolean) => any) | undefined;
"onUpdate:fullscreen"?: ((value: boolean | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare const __VLS_component_10: DefineComponent<__VLS_PublicProps_2, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
"update:selectedGroup": (value: string) => any;
} & {
"item-click": (item: SuggestionItem_2) => any;
close: () => any;
open: () => any;
"group-click": (group: SuggestionGroup) => any;
}, string, PublicProps, Readonly<__VLS_PublicProps_2> & Readonly<{
"onItem-click"?: ((item: SuggestionItem_2) => any) | undefined;
onClose?: (() => any) | undefined;
onOpen?: (() => any) | undefined;
"onGroup-click"?: ((group: SuggestionGroup) => any) | undefined;
"onUpdate:selectedGroup"?: ((value: string) => any) | undefined;
}>, {
title: string;
topOffset: string | number;
trigger: "click" | "manual";
groupShowMoreTrigger: "click" | "hover";
popoverWidth: string | number;
popoverHeight: string | number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
popoverTriggerRef: HTMLDivElement;
popoverRef: HTMLDivElement;
}, HTMLDivElement>;

declare const __VLS_component_2: DefineComponent<DropdownMenuProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
"item-click": (item: DropdownMenuItem) => any;
}, string, PublicProps, Readonly<DropdownMenuProps> & Readonly<{
"onItem-click"?: ((item: DropdownMenuItem) => any) | undefined;
}>, {
minWidth: string | number;
topOffset: string | number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
dropDownTriggerRef: HTMLDivElement;
dropdownMenuRef: HTMLDivElement;
}, HTMLDivElement>;

declare const __VLS_component_3: DefineComponent<PromptsProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
"item-click": (ev: MouseEvent, item: PromptProps) => any;
}, string, PublicProps, Readonly<PromptsProps> & Readonly<{
"onItem-click"?: ((ev: MouseEvent, item: PromptProps) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare const __VLS_component_4: DefineComponent<SenderProps, {
focus: () => void;
blur: () => void;
clear: () => void;
submit: () => void;
startSpeech: () => void;
stopSpeech: () => void;
activateTemplateFirstField: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
[x: string]: any;
} & {
[x: string]: any;
}, string, PublicProps, Readonly<SenderProps> & Readonly<{
[x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
loading: boolean;
template: string;
mode: InputMode_2;
disabled: boolean;
modelValue: string;
autofocus: boolean;
clearable: boolean;
showWordLimit: boolean;
theme: ThemeType_2;
hasContent: boolean;
allowSpeech: boolean;
allowFiles: boolean;
submitType: SubmitTrigger_2;
autoSize: AutoSize_2;
maxLength: number;
placeholder: string;
suggestions: string[];
templateInitialValues: Record<string, string>;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
senderRef: HTMLDivElement;
inputWrapperRef: HTMLDivElement;
templateEditorRef: CreateComponentPublicInstanceWithMixins<Readonly<TemplateEditorProps_2> & Readonly<{
onInput?: ((value: string) => any) | undefined;
onBlur?: ((event: FocusEvent) => any) | undefined;
onFocus?: ((event: FocusEvent) => any) | undefined;
onSubmit?: ((value: string) => any) | undefined;
"onUpdate:value"?: ((value: string) => any) | undefined;
"onContent-status"?: ((hasContent: boolean) => any) | undefined;
}>, {
activateFirstField: () => void;
resetFields: () => void;
focus: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
input: (value: string) => any;
blur: (event: FocusEvent) => any;
focus: (event: FocusEvent) => any;
submit: (value: string) => any;
"update:value": (value: string) => any;
"content-status": (hasContent: boolean) => any;
}, PublicProps, {}, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
contentEditableRef: HTMLDivElement;
}, HTMLDivElement, ComponentProvideOptions, {
P: {};
B: {};
D: {};
C: {};
M: {};
Defaults: {};
}, Readonly<TemplateEditorProps_2> & Readonly<{
onInput?: ((value: string) => any) | undefined;
onBlur?: ((event: FocusEvent) => any) | undefined;
onFocus?: ((event: FocusEvent) => any) | undefined;
onSubmit?: ((value: string) => any) | undefined;
"onUpdate:value"?: ((value: string) => any) | undefined;
"onContent-status"?: ((hasContent: boolean) => any) | undefined;
}>, {
activateFirstField: () => void;
resetFields: () => void;
focus: () => void;
}, {}, {}, {}, {}> | null;
inputRef: CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<    {
_constants: {
type: ObjectConstructor;
default: () => {
INPUT_PC: string;
INPUTGROUP_PC: string;
INPUT_MOBILE: string;
INPUTGROUP_MOBILE: string;
Mode: string;
inputMode(mode: any): string;
inputGroupMode(mode: any): string;
VALIDATE_ICON: {
Validating: string;
Success: string;
Error: string;
};
COMPONENT_NAME: {
FormItem: string;
};
MASKSYMBOL: string;
TEXTAREA_HEIGHT_MOBILE: number;
};
};
name: StringConstructor;
size: StringConstructor;
form: StringConstructor;
label: StringConstructor;
height: NumberConstructor;
resize: StringConstructor;
tabindex: {
type: StringConstructor;
default: string;
};
disabled: BooleanConstructor;
readonly: BooleanConstructor;
hoverExpand: BooleanConstructor;
mask: BooleanConstructor;
suffixIcon: (StringConstructor | ObjectConstructor)[];
prefixIcon: (StringConstructor | ObjectConstructor)[];
modelValue: PropType<string | number | null>;
type: {
type: StringConstructor;
default: string;
};
memorySpace: {
type: NumberConstructor;
default: number;
};
vertical: {
type: BooleanConstructor;
default: boolean;
};
selectMenu: {
type: {
(arrayLength: number): {
id: string;
label: string;
}[];
(...items: {
id: string;
label: string;
}[]): {
id: string;
label: string;
}[];
new (arrayLength: number): {
id: string;
label: string;
}[];
new (...items: {
id: string;
label: string;
}[]): {
id: string;
label: string;
}[];
isArray(arg: any): arg is any[];
readonly prototype: any[];
from<T>(arrayLike: ArrayLike<T>): T[];
from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
of<T_4>(...items: T_4[]): T_4[];
readonly [Symbol.species]: ArrayConstructor;
};
default: () => never[];
};
ellipsis: {
type: BooleanConstructor;
default: boolean;
};
contentStyle: {
type: ObjectConstructor;
default: () => {};
};
isSelect: {
type: BooleanConstructor;
default: boolean;
};
tips: StringConstructor;
counter: {
type: BooleanConstructor;
default: boolean;
};
autosize: {
type: (BooleanConstructor | ObjectConstructor)[];
default: boolean;
};
clearable: {
type: BooleanConstructor;
default: boolean;
};
autocomplete: {
type: StringConstructor;
default: string;
};
showPassword: {
type: BooleanConstructor;
default: boolean;
};
showWordLimit: {
type: BooleanConstructor;
default: boolean;
};
showTitle: {
type: BooleanConstructor;
default: boolean;
};
validateEvent: {
type: BooleanConstructor;
default: boolean;
};
popupMore: {
type: BooleanConstructor;
default: boolean;
};
textareaTitle: {
type: StringConstructor;
default: string;
};
displayOnly: {
type: BooleanConstructor;
default: boolean;
};
displayOnlyContent: {
type: StringConstructor;
default: string;
};
customClass: {
type: StringConstructor;
default: string;
};
frontClearIcon: {
type: BooleanConstructor;
default: boolean;
};
showEmptyValue: {
type: BooleanConstructor;
default: undefined;
};
textAlign: {
type: StringConstructor;
default: string;
};
width: {
type: PropType<string | number | null>;
};
showTooltip: {
type: BooleanConstructor;
default: boolean;
};
inputBoxType: {
type: StringConstructor;
default: string;
validator: (value: string) => boolean;
};
tiny_mode: StringConstructor;
tiny_mode_root: BooleanConstructor;
tiny_template: (ObjectConstructor | FunctionConstructor)[];
tiny_renderless: FunctionConstructor;
tiny_theme: StringConstructor;
tiny_chart_theme: ObjectConstructor;
}>>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, PublicProps, {
disabled: boolean;
type: string;
ellipsis: boolean;
mask: boolean;
tiny_mode_root: boolean;
_constants: Record<string, any>;
tabindex: string;
contentStyle: Record<string, any>;
customClass: string;
showTitle: boolean;
readonly: boolean;
hoverExpand: boolean;
memorySpace: number;
vertical: boolean;
selectMenu: {
id: string;
label: string;
}[];
isSelect: boolean;
counter: boolean;
autosize: boolean | Record<string, any>;
clearable: boolean;
autocomplete: string;
showPassword: boolean;
showWordLimit: boolean;
validateEvent: boolean;
popupMore: boolean;
textareaTitle: string;
displayOnly: boolean;
displayOnlyContent: string;
frontClearIcon: boolean;
showEmptyValue: boolean;
textAlign: string;
showTooltip: boolean;
inputBoxType: string;
}, true, {}, {}, GlobalComponents, GlobalDirectives, string, {}, any, ComponentProvideOptions, {
P: {};
B: {};
D: {};
C: {};
M: {};
Defaults: {};
}, Readonly<ExtractPropTypes<    {
_constants: {
type: ObjectConstructor;
default: () => {
INPUT_PC: string;
INPUTGROUP_PC: string;
INPUT_MOBILE: string;
INPUTGROUP_MOBILE: string;
Mode: string;
inputMode(mode: any): string;
inputGroupMode(mode: any): string;
VALIDATE_ICON: {
Validating: string;
Success: string;
Error: string;
};
COMPONENT_NAME: {
FormItem: string;
};
MASKSYMBOL: string;
TEXTAREA_HEIGHT_MOBILE: number;
};
};
name: StringConstructor;
size: StringConstructor;
form: StringConstructor;
label: StringConstructor;
height: NumberConstructor;
resize: StringConstructor;
tabindex: {
type: StringConstructor;
default: string;
};
disabled: BooleanConstructor;
readonly: BooleanConstructor;
hoverExpand: BooleanConstructor;
mask: BooleanConstructor;
suffixIcon: (StringConstructor | ObjectConstructor)[];
prefixIcon: (StringConstructor | ObjectConstructor)[];
modelValue: PropType<string | number | null>;
type: {
type: StringConstructor;
default: string;
};
memorySpace: {
type: NumberConstructor;
default: number;
};
vertical: {
type: BooleanConstructor;
default: boolean;
};
selectMenu: {
type: {
(arrayLength: number): {
id: string;
label: string;
}[];
(...items: {
id: string;
label: string;
}[]): {
id: string;
label: string;
}[];
new (arrayLength: number): {
id: string;
label: string;
}[];
new (...items: {
id: string;
label: string;
}[]): {
id: string;
label: string;
}[];
isArray(arg: any): arg is any[];
readonly prototype: any[];
from<T>(arrayLike: ArrayLike<T>): T[];
from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
of<T_4>(...items: T_4[]): T_4[];
readonly [Symbol.species]: ArrayConstructor;
};
default: () => never[];
};
ellipsis: {
type: BooleanConstructor;
default: boolean;
};
contentStyle: {
type: ObjectConstructor;
default: () => {};
};
isSelect: {
type: BooleanConstructor;
default: boolean;
};
tips: StringConstructor;
counter: {
type: BooleanConstructor;
default: boolean;
};
autosize: {
type: (BooleanConstructor | ObjectConstructor)[];
default: boolean;
};
clearable: {
type: BooleanConstructor;
default: boolean;
};
autocomplete: {
type: StringConstructor;
default: string;
};
showPassword: {
type: BooleanConstructor;
default: boolean;
};
showWordLimit: {
type: BooleanConstructor;
default: boolean;
};
showTitle: {
type: BooleanConstructor;
default: boolean;
};
validateEvent: {
type: BooleanConstructor;
default: boolean;
};
popupMore: {
type: BooleanConstructor;
default: boolean;
};
textareaTitle: {
type: StringConstructor;
default: string;
};
displayOnly: {
type: BooleanConstructor;
default: boolean;
};
displayOnlyContent: {
type: StringConstructor;
default: string;
};
customClass: {
type: StringConstructor;
default: string;
};
frontClearIcon: {
type: BooleanConstructor;
default: boolean;
};
showEmptyValue: {
type: BooleanConstructor;
default: undefined;
};
textAlign: {
type: StringConstructor;
default: string;
};
width: {
type: PropType<string | number | null>;
};
showTooltip: {
type: BooleanConstructor;
default: boolean;
};
inputBoxType: {
type: StringConstructor;
default: string;
validator: (value: string) => boolean;
};
tiny_mode: StringConstructor;
tiny_mode_root: BooleanConstructor;
tiny_template: (ObjectConstructor | FunctionConstructor)[];
tiny_renderless: FunctionConstructor;
tiny_theme: StringConstructor;
tiny_chart_theme: ObjectConstructor;
}>>, () => VNode<RendererNode, RendererElement, {
[key: string]: any;
}>, {}, {}, {}, {
disabled: boolean;
type: string;
ellipsis: boolean;
mask: boolean;
tiny_mode_root: boolean;
_constants: Record<string, any>;
tabindex: string;
contentStyle: Record<string, any>;
customClass: string;
showTitle: boolean;
readonly: boolean;
hoverExpand: boolean;
memorySpace: number;
vertical: boolean;
selectMenu: {
id: string;
label: string;
}[];
isSelect: boolean;
counter: boolean;
autosize: boolean | Record<string, any>;
clearable: boolean;
autocomplete: string;
showPassword: boolean;
showWordLimit: boolean;
validateEvent: boolean;
popupMore: boolean;
textareaTitle: string;
displayOnly: boolean;
displayOnlyContent: string;
frontClearIcon: boolean;
showEmptyValue: boolean;
textAlign: string;
showTooltip: boolean;
inputBoxType: string;
}> | null;
buttonsContainerRef: HTMLDivElement;
suggestionsListRef: HTMLDivElement;
}, HTMLDivElement>;

declare const __VLS_component_5: DefineComponent<WelcomeProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<WelcomeProps> & Readonly<{}>, {
align: "left" | "center" | "right" | string;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare const __VLS_component_6: DefineComponent<SuggestionProps, {
trigger: TriggerHandler;
keyDown: (e: KeyboardEvent) => void;
input: (event: Event, text: string) => boolean;
toggleExpand: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
select: (value: string, context?: TriggerContext | undefined) => any;
close: () => any;
"suggestion-select": (item: SuggestionItem) => any;
"update:open": (value: boolean) => any;
trigger: (handler: TriggerHandler) => any;
"category-select": (category: Category) => any;
"update:expanded": (expanded: boolean) => any;
"fill-template": (template: string) => any;
}, string, PublicProps, Readonly<SuggestionProps> & Readonly<{
onSelect?: ((value: string, context?: TriggerContext | undefined) => any) | undefined;
onClose?: (() => any) | undefined;
"onSuggestion-select"?: ((item: SuggestionItem) => any) | undefined;
"onUpdate:open"?: ((value: boolean) => any) | undefined;
onTrigger?: ((handler: TriggerHandler) => any) | undefined;
"onCategory-select"?: ((category: Category) => any) | undefined;
"onUpdate:expanded"?: ((expanded: boolean) => any) | undefined;
"onFill-template"?: ((template: string) => any) | undefined;
}>, {
loading: boolean;
title: string;
items: SuggestionItem[];
categories: Category[];
theme: "light" | "dark";
maxVisibleItems: number;
triggerKeys: string[];
open: boolean;
closeOnOutsideClick: boolean;
defaultExpanded: boolean;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
rootRef: HTMLDivElement;
panelRef: ({
$: ComponentInternalInstance;
$data: {};
$props: Partial<{
loading: boolean;
title: string;
categories: Category[];
maxVisibleItems: number;
}> & Omit<{
readonly loading: boolean;
readonly title: string;
readonly items: SuggestionItem[];
readonly categories: Category[];
readonly maxVisibleItems: number;
readonly onSelect?: ((...args: any[]) => any) | undefined;
readonly onClose?: ((...args: any[]) => any) | undefined;
readonly "onCategory-select"?: ((...args: any[]) => any) | undefined;
readonly "onItem-hover"?: ((...args: any[]) => any) | undefined;
} & VNodeProps & AllowedComponentProps & ComponentCustomProps, "loading" | "title" | "categories" | "maxVisibleItems">;
$attrs: {
[x: string]: unknown;
};
$refs: {
[x: string]: unknown;
};
$slots: Readonly<{
[name: string]: Slot<any> | undefined;
}>;
$root: ComponentPublicInstance | null;
$parent: ComponentPublicInstance | null;
$host: Element | null;
$emit: ((event: "select", ...args: any[]) => void) & ((event: "close", ...args: any[]) => void) & ((event: "category-select", ...args: any[]) => void) & ((event: "item-hover", ...args: any[]) => void);
$el: HTMLDivElement;
$options: ComponentOptionsBase<Readonly<ExtractPropTypes<    {
items: {
type: PropType<SuggestionItem[]>;
required: true;
};
categories: {
type: PropType<Category[]>;
default: () => never[];
};
loading: {
type: BooleanConstructor;
default: boolean;
};
title: {
type: StringConstructor;
default: string;
};
maxVisibleItems: {
type: NumberConstructor;
default: number;
};
}>> & Readonly<{
onSelect?: ((...args: any[]) => any) | undefined;
onClose?: ((...args: any[]) => any) | undefined;
"onCategory-select"?: ((...args: any[]) => any) | undefined;
"onItem-hover"?: ((...args: any[]) => any) | undefined;
}>, {
handleKeyDown: (e: KeyboardEvent) => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
select: (...args: any[]) => void;
close: (...args: any[]) => void;
"category-select": (...args: any[]) => void;
"item-hover": (...args: any[]) => void;
}, string, {
loading: boolean;
title: string;
categories: Category[];
maxVisibleItems: number;
}, {}, string, {}, GlobalComponents, GlobalDirectives, string, ComponentProvideOptions> & {
beforeCreate?: (() => void) | (() => void)[];
created?: (() => void) | (() => void)[];
beforeMount?: (() => void) | (() => void)[];
mounted?: (() => void) | (() => void)[];
beforeUpdate?: (() => void) | (() => void)[];
updated?: (() => void) | (() => void)[];
activated?: (() => void) | (() => void)[];
deactivated?: (() => void) | (() => void)[];
beforeDestroy?: (() => void) | (() => void)[];
beforeUnmount?: (() => void) | (() => void)[];
destroyed?: (() => void) | (() => void)[];
unmounted?: (() => void) | (() => void)[];
renderTracked?: ((e: DebuggerEvent) => void) | ((e: DebuggerEvent) => void)[];
renderTriggered?: ((e: DebuggerEvent) => void) | ((e: DebuggerEvent) => void)[];
errorCaptured?: ((err: unknown, instance: ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: ComponentPublicInstance | null, info: string) => boolean | void)[];
};
$forceUpdate: () => void;
$nextTick: nextTick;
$watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, OnCleanup]) => any : (...args: [any, any, OnCleanup]) => any, options?: WatchOptions): WatchStopHandle;
} & Readonly<{
loading: boolean;
title: string;
categories: Category[];
maxVisibleItems: number;
}> & Omit<Readonly<ExtractPropTypes<    {
items: {
type: PropType<SuggestionItem[]>;
required: true;
};
categories: {
type: PropType<Category[]>;
default: () => never[];
};
loading: {
type: BooleanConstructor;
default: boolean;
};
title: {
type: StringConstructor;
default: string;
};
maxVisibleItems: {
type: NumberConstructor;
default: number;
};
}>> & Readonly<{
onSelect?: ((...args: any[]) => any) | undefined;
onClose?: ((...args: any[]) => any) | undefined;
"onCategory-select"?: ((...args: any[]) => any) | undefined;
"onItem-hover"?: ((...args: any[]) => any) | undefined;
}>, "handleKeyDown" | ("loading" | "title" | "categories" | "maxVisibleItems")> & ShallowUnwrapRef<    {
handleKeyDown: (e: KeyboardEvent) => void;
}> & {} & ComponentCustomProperties & {} & {
$slots: {
'title-icon'?(_: {}): any;
'loading-indicator'?(_: {}): any;
item?(_: {
item: SuggestionItem;
active: boolean;
}): any;
empty?(_: {}): any;
};
}) | null;
}, HTMLDivElement>;

declare const __VLS_component_7: DefineComponent<SuggestionPillsProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
"item-click": (item: SuggestionPillItem_2<Record<string, unknown>>) => any;
}, string, PublicProps, Readonly<SuggestionPillsProps> & Readonly<{
"onItem-click"?: ((item: SuggestionPillItem_2<Record<string, unknown>>) => any) | undefined;
}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {
containerRef: HTMLDivElement;
}, HTMLDivElement>;

declare const __VLS_component_8: DefineComponent<SuggestionPillButtonProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<SuggestionPillButtonProps> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLButtonElement>;

declare const __VLS_component_9: DefineComponent<QuestionProps, {
openModal: () => void;
closeModal: () => void;
toggleFloating: () => void;
setActiveCategory: (categoryId: string) => void;
refreshData: () => Promise<void>;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
"question-click": (question: Question_2) => any;
"select-category": (category: Category_2) => any;
}, string, PublicProps, Readonly<QuestionProps> & Readonly<{
"onQuestion-click"?: ((question: Question_2) => any) | undefined;
"onSelect-category"?: ((category: Category_2) => any) | undefined;
}>, {
loading: boolean;
categories: Category_2[];
modalWidth: string;
closeOnClickOutside: boolean;
commonQuestions: Question_2[];
initialExpanded: boolean;
theme: ThemeType_2;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare type __VLS_Props = SuggestionPopoverProps;

declare type __VLS_PublicProps = {
    'show': ContainerProps['show'];
    'fullscreen'?: ContainerProps['fullscreen'];
};

declare type __VLS_PublicProps_2 = {
    'selectedGroup'?: string;
} & __VLS_Props;

declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: Readonly<ContainerSlots> & ContainerSlots;
    refs: {};
    rootEl: HTMLDivElement;
};

declare function __VLS_template_10(): {
    attrs: Partial<{}>;
    slots: Readonly<SuggestionPopoverSlots> & SuggestionPopoverSlots;
    refs: {
        popoverTriggerRef: HTMLDivElement;
        popoverRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_2(): {
    attrs: Partial<{}>;
    slots: Readonly<DropdownMenuSlots> & DropdownMenuSlots;
    refs: {
        dropDownTriggerRef: HTMLDivElement;
        dropdownMenuRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_3(): {
    attrs: Partial<{}>;
    slots: Readonly<PromptsSlots> & PromptsSlots;
    refs: {};
    rootEl: HTMLDivElement;
};

declare function __VLS_template_4(): {
    attrs: Partial<{}>;
    slots: {
        header?(_: {}): any;
        prefix?(_: {}): any;
        decorativeContent?(_: {}): any;
        actions?(_: {}): any;
        'footer-left'?(_: {}): any;
        'footer-right'?(_: {}): any;
        footer?(_: {}): any;
    };
    refs: {
        senderRef: HTMLDivElement;
        inputWrapperRef: HTMLDivElement;
        templateEditorRef: CreateComponentPublicInstanceWithMixins<Readonly<TemplateEditorProps_2> & Readonly<{
        onInput?: ((value: string) => any) | undefined;
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        onSubmit?: ((value: string) => any) | undefined;
        "onUpdate:value"?: ((value: string) => any) | undefined;
        "onContent-status"?: ((hasContent: boolean) => any) | undefined;
        }>, {
        activateFirstField: () => void;
        resetFields: () => void;
        focus: () => void;
        }, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
        input: (value: string) => any;
        blur: (event: FocusEvent) => any;
        focus: (event: FocusEvent) => any;
        submit: (value: string) => any;
        "update:value": (value: string) => any;
        "content-status": (hasContent: boolean) => any;
        }, PublicProps, {}, false, {}, {}, GlobalComponents, GlobalDirectives, string, {
        contentEditableRef: HTMLDivElement;
        }, HTMLDivElement, ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
        }, Readonly<TemplateEditorProps_2> & Readonly<{
        onInput?: ((value: string) => any) | undefined;
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        onSubmit?: ((value: string) => any) | undefined;
        "onUpdate:value"?: ((value: string) => any) | undefined;
        "onContent-status"?: ((hasContent: boolean) => any) | undefined;
        }>, {
        activateFirstField: () => void;
        resetFields: () => void;
        focus: () => void;
        }, {}, {}, {}, {}> | null;
        inputRef: CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<    {
        _constants: {
        type: ObjectConstructor;
        default: () => {
        INPUT_PC: string;
        INPUTGROUP_PC: string;
        INPUT_MOBILE: string;
        INPUTGROUP_MOBILE: string;
        Mode: string;
        inputMode(mode: any): string;
        inputGroupMode(mode: any): string;
        VALIDATE_ICON: {
        Validating: string;
        Success: string;
        Error: string;
        };
        COMPONENT_NAME: {
        FormItem: string;
        };
        MASKSYMBOL: string;
        TEXTAREA_HEIGHT_MOBILE: number;
        };
        };
        name: StringConstructor;
        size: StringConstructor;
        form: StringConstructor;
        label: StringConstructor;
        height: NumberConstructor;
        resize: StringConstructor;
        tabindex: {
        type: StringConstructor;
        default: string;
        };
        disabled: BooleanConstructor;
        readonly: BooleanConstructor;
        hoverExpand: BooleanConstructor;
        mask: BooleanConstructor;
        suffixIcon: (StringConstructor | ObjectConstructor)[];
        prefixIcon: (StringConstructor | ObjectConstructor)[];
        modelValue: PropType<string | number | null>;
        type: {
        type: StringConstructor;
        default: string;
        };
        memorySpace: {
        type: NumberConstructor;
        default: number;
        };
        vertical: {
        type: BooleanConstructor;
        default: boolean;
        };
        selectMenu: {
        type: {
        (arrayLength: number): {
        id: string;
        label: string;
        }[];
        (...items: {
        id: string;
        label: string;
        }[]): {
        id: string;
        label: string;
        }[];
        new (arrayLength: number): {
        id: string;
        label: string;
        }[];
        new (...items: {
        id: string;
        label: string;
        }[]): {
        id: string;
        label: string;
        }[];
        isArray(arg: any): arg is any[];
        readonly prototype: any[];
        from<T>(arrayLike: ArrayLike<T>): T[];
        from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
        from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
        from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
        of<T_4>(...items: T_4[]): T_4[];
        readonly [Symbol.species]: ArrayConstructor;
        };
        default: () => never[];
        };
        ellipsis: {
        type: BooleanConstructor;
        default: boolean;
        };
        contentStyle: {
        type: ObjectConstructor;
        default: () => {};
        };
        isSelect: {
        type: BooleanConstructor;
        default: boolean;
        };
        tips: StringConstructor;
        counter: {
        type: BooleanConstructor;
        default: boolean;
        };
        autosize: {
        type: (BooleanConstructor | ObjectConstructor)[];
        default: boolean;
        };
        clearable: {
        type: BooleanConstructor;
        default: boolean;
        };
        autocomplete: {
        type: StringConstructor;
        default: string;
        };
        showPassword: {
        type: BooleanConstructor;
        default: boolean;
        };
        showWordLimit: {
        type: BooleanConstructor;
        default: boolean;
        };
        showTitle: {
        type: BooleanConstructor;
        default: boolean;
        };
        validateEvent: {
        type: BooleanConstructor;
        default: boolean;
        };
        popupMore: {
        type: BooleanConstructor;
        default: boolean;
        };
        textareaTitle: {
        type: StringConstructor;
        default: string;
        };
        displayOnly: {
        type: BooleanConstructor;
        default: boolean;
        };
        displayOnlyContent: {
        type: StringConstructor;
        default: string;
        };
        customClass: {
        type: StringConstructor;
        default: string;
        };
        frontClearIcon: {
        type: BooleanConstructor;
        default: boolean;
        };
        showEmptyValue: {
        type: BooleanConstructor;
        default: undefined;
        };
        textAlign: {
        type: StringConstructor;
        default: string;
        };
        width: {
        type: PropType<string | number | null>;
        };
        showTooltip: {
        type: BooleanConstructor;
        default: boolean;
        };
        inputBoxType: {
        type: StringConstructor;
        default: string;
        validator: (value: string) => boolean;
        };
        tiny_mode: StringConstructor;
        tiny_mode_root: BooleanConstructor;
        tiny_template: (ObjectConstructor | FunctionConstructor)[];
        tiny_renderless: FunctionConstructor;
        tiny_theme: StringConstructor;
        tiny_chart_theme: ObjectConstructor;
        }>>, () => VNode<RendererNode, RendererElement, {
        [key: string]: any;
        }>, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, PublicProps, {
        disabled: boolean;
        type: string;
        ellipsis: boolean;
        mask: boolean;
        tiny_mode_root: boolean;
        _constants: Record<string, any>;
        tabindex: string;
        contentStyle: Record<string, any>;
        customClass: string;
        showTitle: boolean;
        readonly: boolean;
        hoverExpand: boolean;
        memorySpace: number;
        vertical: boolean;
        selectMenu: {
        id: string;
        label: string;
        }[];
        isSelect: boolean;
        counter: boolean;
        autosize: boolean | Record<string, any>;
        clearable: boolean;
        autocomplete: string;
        showPassword: boolean;
        showWordLimit: boolean;
        validateEvent: boolean;
        popupMore: boolean;
        textareaTitle: string;
        displayOnly: boolean;
        displayOnlyContent: string;
        frontClearIcon: boolean;
        showEmptyValue: boolean;
        textAlign: string;
        showTooltip: boolean;
        inputBoxType: string;
        }, true, {}, {}, GlobalComponents, GlobalDirectives, string, {}, any, ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
        }, Readonly<ExtractPropTypes<    {
        _constants: {
        type: ObjectConstructor;
        default: () => {
        INPUT_PC: string;
        INPUTGROUP_PC: string;
        INPUT_MOBILE: string;
        INPUTGROUP_MOBILE: string;
        Mode: string;
        inputMode(mode: any): string;
        inputGroupMode(mode: any): string;
        VALIDATE_ICON: {
        Validating: string;
        Success: string;
        Error: string;
        };
        COMPONENT_NAME: {
        FormItem: string;
        };
        MASKSYMBOL: string;
        TEXTAREA_HEIGHT_MOBILE: number;
        };
        };
        name: StringConstructor;
        size: StringConstructor;
        form: StringConstructor;
        label: StringConstructor;
        height: NumberConstructor;
        resize: StringConstructor;
        tabindex: {
        type: StringConstructor;
        default: string;
        };
        disabled: BooleanConstructor;
        readonly: BooleanConstructor;
        hoverExpand: BooleanConstructor;
        mask: BooleanConstructor;
        suffixIcon: (StringConstructor | ObjectConstructor)[];
        prefixIcon: (StringConstructor | ObjectConstructor)[];
        modelValue: PropType<string | number | null>;
        type: {
        type: StringConstructor;
        default: string;
        };
        memorySpace: {
        type: NumberConstructor;
        default: number;
        };
        vertical: {
        type: BooleanConstructor;
        default: boolean;
        };
        selectMenu: {
        type: {
        (arrayLength: number): {
        id: string;
        label: string;
        }[];
        (...items: {
        id: string;
        label: string;
        }[]): {
        id: string;
        label: string;
        }[];
        new (arrayLength: number): {
        id: string;
        label: string;
        }[];
        new (...items: {
        id: string;
        label: string;
        }[]): {
        id: string;
        label: string;
        }[];
        isArray(arg: any): arg is any[];
        readonly prototype: any[];
        from<T>(arrayLike: ArrayLike<T>): T[];
        from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
        from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
        from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
        of<T_4>(...items: T_4[]): T_4[];
        readonly [Symbol.species]: ArrayConstructor;
        };
        default: () => never[];
        };
        ellipsis: {
        type: BooleanConstructor;
        default: boolean;
        };
        contentStyle: {
        type: ObjectConstructor;
        default: () => {};
        };
        isSelect: {
        type: BooleanConstructor;
        default: boolean;
        };
        tips: StringConstructor;
        counter: {
        type: BooleanConstructor;
        default: boolean;
        };
        autosize: {
        type: (BooleanConstructor | ObjectConstructor)[];
        default: boolean;
        };
        clearable: {
        type: BooleanConstructor;
        default: boolean;
        };
        autocomplete: {
        type: StringConstructor;
        default: string;
        };
        showPassword: {
        type: BooleanConstructor;
        default: boolean;
        };
        showWordLimit: {
        type: BooleanConstructor;
        default: boolean;
        };
        showTitle: {
        type: BooleanConstructor;
        default: boolean;
        };
        validateEvent: {
        type: BooleanConstructor;
        default: boolean;
        };
        popupMore: {
        type: BooleanConstructor;
        default: boolean;
        };
        textareaTitle: {
        type: StringConstructor;
        default: string;
        };
        displayOnly: {
        type: BooleanConstructor;
        default: boolean;
        };
        displayOnlyContent: {
        type: StringConstructor;
        default: string;
        };
        customClass: {
        type: StringConstructor;
        default: string;
        };
        frontClearIcon: {
        type: BooleanConstructor;
        default: boolean;
        };
        showEmptyValue: {
        type: BooleanConstructor;
        default: undefined;
        };
        textAlign: {
        type: StringConstructor;
        default: string;
        };
        width: {
        type: PropType<string | number | null>;
        };
        showTooltip: {
        type: BooleanConstructor;
        default: boolean;
        };
        inputBoxType: {
        type: StringConstructor;
        default: string;
        validator: (value: string) => boolean;
        };
        tiny_mode: StringConstructor;
        tiny_mode_root: BooleanConstructor;
        tiny_template: (ObjectConstructor | FunctionConstructor)[];
        tiny_renderless: FunctionConstructor;
        tiny_theme: StringConstructor;
        tiny_chart_theme: ObjectConstructor;
        }>>, () => VNode<RendererNode, RendererElement, {
        [key: string]: any;
        }>, {}, {}, {}, {
        disabled: boolean;
        type: string;
        ellipsis: boolean;
        mask: boolean;
        tiny_mode_root: boolean;
        _constants: Record<string, any>;
        tabindex: string;
        contentStyle: Record<string, any>;
        customClass: string;
        showTitle: boolean;
        readonly: boolean;
        hoverExpand: boolean;
        memorySpace: number;
        vertical: boolean;
        selectMenu: {
        id: string;
        label: string;
        }[];
        isSelect: boolean;
        counter: boolean;
        autosize: boolean | Record<string, any>;
        clearable: boolean;
        autocomplete: string;
        showPassword: boolean;
        showWordLimit: boolean;
        validateEvent: boolean;
        popupMore: boolean;
        textareaTitle: string;
        displayOnly: boolean;
        displayOnlyContent: string;
        frontClearIcon: boolean;
        showEmptyValue: boolean;
        textAlign: string;
        showTooltip: boolean;
        inputBoxType: string;
        }> | null;
        buttonsContainerRef: HTMLDivElement;
        suggestionsListRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_5(): {
    attrs: Partial<{}>;
    slots: Readonly<WelcomeSlots> & WelcomeSlots;
    refs: {};
    rootEl: HTMLDivElement;
};

declare function __VLS_template_6(): {
    attrs: Partial<{}>;
    slots: {
        'capsule-icon'?(_: {
            suggestion: any;
        }): any;
        trigger?(_: {
            onTrigger: TriggerHandler;
            onKeyDown: (e: KeyboardEvent) => void;
            onInput: (event: Event, text: string) => boolean;
        }): any;
        'title-icon'?(_: {}): any;
        'category-label'?(_: {
            category: any;
        }): any;
        item?(_: {
            item: SuggestionItem;
            active: boolean;
        }): any;
        'loading-indicator'?(_: {}): any;
        empty?(_: {}): any;
    };
    refs: {
        rootRef: HTMLDivElement;
        panelRef: ({
            $: ComponentInternalInstance;
            $data: {};
            $props: Partial<{
                loading: boolean;
                title: string;
                categories: Category[];
                maxVisibleItems: number;
            }> & Omit<{
                readonly loading: boolean;
                readonly title: string;
                readonly items: SuggestionItem[];
                readonly categories: Category[];
                readonly maxVisibleItems: number;
                readonly onSelect?: ((...args: any[]) => any) | undefined;
                readonly onClose?: ((...args: any[]) => any) | undefined;
                readonly "onCategory-select"?: ((...args: any[]) => any) | undefined;
                readonly "onItem-hover"?: ((...args: any[]) => any) | undefined;
            } & VNodeProps & AllowedComponentProps & ComponentCustomProps, "loading" | "title" | "categories" | "maxVisibleItems">;
            $attrs: {
                [x: string]: unknown;
            };
            $refs: {
                [x: string]: unknown;
            };
            $slots: Readonly<{
                [name: string]: Slot<any> | undefined;
            }>;
            $root: ComponentPublicInstance | null;
            $parent: ComponentPublicInstance | null;
            $host: Element | null;
            $emit: ((event: "select", ...args: any[]) => void) & ((event: "close", ...args: any[]) => void) & ((event: "category-select", ...args: any[]) => void) & ((event: "item-hover", ...args: any[]) => void);
            $el: HTMLDivElement;
            $options: ComponentOptionsBase<Readonly<ExtractPropTypes<    {
            items: {
            type: PropType<SuggestionItem[]>;
            required: true;
            };
            categories: {
            type: PropType<Category[]>;
            default: () => never[];
            };
            loading: {
            type: BooleanConstructor;
            default: boolean;
            };
            title: {
            type: StringConstructor;
            default: string;
            };
            maxVisibleItems: {
            type: NumberConstructor;
            default: number;
            };
            }>> & Readonly<{
            onSelect?: ((...args: any[]) => any) | undefined;
            onClose?: ((...args: any[]) => any) | undefined;
            "onCategory-select"?: ((...args: any[]) => any) | undefined;
            "onItem-hover"?: ((...args: any[]) => any) | undefined;
            }>, {
            handleKeyDown: (e: KeyboardEvent) => void;
            }, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
            select: (...args: any[]) => void;
            close: (...args: any[]) => void;
            "category-select": (...args: any[]) => void;
            "item-hover": (...args: any[]) => void;
            }, string, {
            loading: boolean;
            title: string;
            categories: Category[];
            maxVisibleItems: number;
            }, {}, string, {}, GlobalComponents, GlobalDirectives, string, ComponentProvideOptions> & {
                beforeCreate?: (() => void) | (() => void)[];
                created?: (() => void) | (() => void)[];
                beforeMount?: (() => void) | (() => void)[];
                mounted?: (() => void) | (() => void)[];
                beforeUpdate?: (() => void) | (() => void)[];
                updated?: (() => void) | (() => void)[];
                activated?: (() => void) | (() => void)[];
                deactivated?: (() => void) | (() => void)[];
                beforeDestroy?: (() => void) | (() => void)[];
                beforeUnmount?: (() => void) | (() => void)[];
                destroyed?: (() => void) | (() => void)[];
                unmounted?: (() => void) | (() => void)[];
                renderTracked?: ((e: DebuggerEvent) => void) | ((e: DebuggerEvent) => void)[];
                renderTriggered?: ((e: DebuggerEvent) => void) | ((e: DebuggerEvent) => void)[];
                errorCaptured?: ((err: unknown, instance: ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: ComponentPublicInstance | null, info: string) => boolean | void)[];
            };
            $forceUpdate: () => void;
            $nextTick: nextTick;
            $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, OnCleanup]) => any : (...args: [any, any, OnCleanup]) => any, options?: WatchOptions): WatchStopHandle;
        } & Readonly<{
            loading: boolean;
            title: string;
            categories: Category[];
            maxVisibleItems: number;
        }> & Omit<Readonly<ExtractPropTypes<    {
        items: {
        type: PropType<SuggestionItem[]>;
        required: true;
        };
        categories: {
        type: PropType<Category[]>;
        default: () => never[];
        };
        loading: {
        type: BooleanConstructor;
        default: boolean;
        };
        title: {
        type: StringConstructor;
        default: string;
        };
        maxVisibleItems: {
        type: NumberConstructor;
        default: number;
        };
        }>> & Readonly<{
            onSelect?: ((...args: any[]) => any) | undefined;
            onClose?: ((...args: any[]) => any) | undefined;
            "onCategory-select"?: ((...args: any[]) => any) | undefined;
            "onItem-hover"?: ((...args: any[]) => any) | undefined;
        }>, "handleKeyDown" | ("loading" | "title" | "categories" | "maxVisibleItems")> & ShallowUnwrapRef<    {
        handleKeyDown: (e: KeyboardEvent) => void;
        }> & {} & ComponentCustomProperties & {} & {
            $slots: {
                'title-icon'?(_: {}): any;
                'loading-indicator'?(_: {}): any;
                item?(_: {
                    item: SuggestionItem;
                    active: boolean;
                }): any;
                empty?(_: {}): any;
            };
        }) | null;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_7(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {
        containerRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};

declare function __VLS_template_8(): {
    attrs: Partial<{}>;
    slots: Readonly<SuggestionPillButtonSlots> & SuggestionPillButtonSlots;
    refs: {};
    rootEl: HTMLButtonElement;
};

declare function __VLS_template_9(): {
    attrs: Partial<{}>;
    slots: {
        'category-label'?(_: {
            category: Category_2;
        }): any;
        'question-item'?(_: {
            question: Question_2;
            index: number;
        }): any;
        'loading-indicator'?(_: {}): any;
        'empty-state'?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};

declare type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;

declare type __VLS_TemplateResult_10 = ReturnType<typeof __VLS_template_10>;

declare type __VLS_TemplateResult_2 = ReturnType<typeof __VLS_template_2>;

declare type __VLS_TemplateResult_3 = ReturnType<typeof __VLS_template_3>;

declare type __VLS_TemplateResult_4 = ReturnType<typeof __VLS_template_4>;

declare type __VLS_TemplateResult_5 = ReturnType<typeof __VLS_template_5>;

declare type __VLS_TemplateResult_6 = ReturnType<typeof __VLS_template_6>;

declare type __VLS_TemplateResult_7 = ReturnType<typeof __VLS_template_7>;

declare type __VLS_TemplateResult_8 = ReturnType<typeof __VLS_template_8>;

declare type __VLS_TemplateResult_9 = ReturnType<typeof __VLS_template_9>;

declare type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_10<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_2<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_3<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_4<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_5<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_6<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_7<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_8<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare type __VLS_WithTemplateSlots_9<T, S> = T & {
    new (): {
        $slots: S;
    };
};

export declare interface ActionButtonsProps {
    loading?: boolean;
    disabled?: boolean;
    showClear?: boolean;
    hasContent?: boolean;
    allowSpeech?: boolean;
    speechStatus?: {
        isRecording: boolean;
        isSupported: boolean;
    };
    allowFiles?: boolean;
    submitType?: SubmitTrigger;
    showShortcuts?: boolean;
    isOverLimit?: boolean;
}

export declare type AutoSize = boolean | {
    minRows: number;
    maxRows: number;
};

declare interface BaseHistoryProps {
    activeTab?: string;
    searchBar?: boolean;
    searchQuery?: string;
    searchPlaceholder?: string;
    searchFn?: (query: string, item: HistoryItem) => boolean;
    selected?: string;
}

declare const Bubble: typeof default_2 & {
    install: typeof bubbleInstall;
};
export { Bubble }
export { Bubble as TrBubble }

declare const bubbleInstall: (app: App) => void;

declare const BubbleList: typeof _default_14 & {
    install: typeof bubbleListInstall;
};
export { BubbleList }
export { BubbleList as TrBubbleList }

declare const bubbleListInstall: (app: App) => void;

export declare interface BubbleListProps {
    items: (BubbleProps & {
        slots?: BubbleSlots;
    })[];
    /**
     * 每个角色的默认配置项
     */
    roles?: Record<string, BubbleRoleConfig>;
    autoScroll?: boolean;
}

export declare type BubblePalcement = 'start' | 'end';

export declare interface BubbleProps {
    /**
     * 气泡内容
     */
    content?: string;
    id?: string | number | symbol;
    /**
     * 气泡位置
     */
    placement?: BubblePalcement;
    avatar?: VNode;
    role?: string;
    /**
     * 内容类型
     */
    type?: 'text' | 'markdown';
    loading?: boolean;
    aborted?: boolean;
    /**
     * type 为 'markdown' 时，markdown 的配置项
     */
    mdConfig?: Options;
    maxWidth?: CSSProperties['maxWidth'];
}

export declare type BubbleRoleConfig = Pick<BubbleProps, 'placement' | 'avatar' | 'type' | 'mdConfig' | 'maxWidth'> & {
    slots?: BubbleSlots;
};

export declare interface BubbleSlots {
    default?: (slotProps: {
        bubbleProps: BubbleProps;
    }) => unknown;
    footer?: (slotProps: {
        bubbleProps: BubbleProps;
    }) => unknown;
    loading?: (slotProps: {
        bubbleProps: BubbleProps;
    }) => unknown;
}

/**
 * 分类定义
 */
export declare interface Category {
    /** 唯一标识 */
    id: string;
    /** 显示名称 */
    label: string;
    /** 可选图标 */
    icon?: VNode;
    /** 该分类下的指令项 */
    items: SuggestionItem[];
}

declare interface Category_2 {
    id: string;
    label: string;
    icon?: string;
    questions: Question_2[];
}

export declare interface ContainerProps {
    /**
     * model:show
     */
    show: boolean;
    /**
     * model:fullscreen
     */
    fullscreen?: boolean;
}

export declare interface ContainerSlots {
    default: () => unknown;
    title: () => unknown;
    operations: () => unknown;
    footer: () => unknown;
}

declare const _default: {
    install<T>(app: App<T>): void;
};
export default _default;

declare const _default_10: typeof _default_24 & {
    install: typeof install_8;
};
export { _default_10 as Suggestion }
export { _default_10 as TrSuggestion }

declare const _default_11: typeof _default_25 & {
    install: typeof install_9;
};
export { _default_11 as SuggestionPills }
export { _default_11 as TrSuggestionPills }

declare const _default_12: typeof _default_27 & {
    install: typeof install_10;
};
export { _default_12 as Question }
export { _default_12 as TrQuestion }

declare const _default_13: typeof _default_28 & {
    install: typeof install_11;
};
export { _default_13 as SuggestionPopover }
export { _default_13 as TrSuggestionPopover }

declare const _default_14: DefineComponent<BubbleListProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<BubbleListProps> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {
scrollContainerRef: HTMLDivElement;
}, HTMLDivElement>;

declare const _default_15: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;

declare const _default_16: DefineComponent<    {}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, true, {}, any>;

declare const _default_17: __VLS_WithTemplateSlots_2<typeof __VLS_component_2, __VLS_TemplateResult_2["slots"]>;

declare const _default_18: DefineComponent<FeedbackProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
operation: (name: string) => any;
action: (name: string) => any;
}, string, PublicProps, Readonly<FeedbackProps> & Readonly<{
onOperation?: ((name: string) => any) | undefined;
onAction?: ((name: string) => any) | undefined;
}>, {
operationsLimit: number;
actionsLimit: number;
sourcesLinesLimit: number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare const _default_19: DefineComponent<IconButtonProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<IconButtonProps> & Readonly<{}>, {
size: string | number;
svgSize: string | number;
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLButtonElement>;

declare const _default_2: typeof _default_15 & {
    install: typeof install;
};
export { _default_2 as Container }
export { _default_2 as TrContainer }

declare const _default_20: DefineComponent<PromptProps, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<PromptProps> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare const _default_21: __VLS_WithTemplateSlots_3<typeof __VLS_component_3, __VLS_TemplateResult_3["slots"]>;

declare const _default_22: __VLS_WithTemplateSlots_4<typeof __VLS_component_4, __VLS_TemplateResult_4["slots"]>;

declare const _default_23: __VLS_WithTemplateSlots_5<typeof __VLS_component_5, __VLS_TemplateResult_5["slots"]>;

declare const _default_24: __VLS_WithTemplateSlots_6<typeof __VLS_component_6, __VLS_TemplateResult_6["slots"]>;

declare const _default_25: __VLS_WithTemplateSlots_7<typeof __VLS_component_7, __VLS_TemplateResult_7["slots"]>;

declare const _default_26: __VLS_WithTemplateSlots_8<typeof __VLS_component_8, __VLS_TemplateResult_8["slots"]>;

declare const _default_27: __VLS_WithTemplateSlots_9<typeof __VLS_component_9, __VLS_TemplateResult_9["slots"]>;

declare const _default_28: __VLS_WithTemplateSlots_10<typeof __VLS_component_10, __VLS_TemplateResult_10["slots"]>;

declare const _default_3: typeof _default_16 & {
    install: typeof install_2;
};
export { _default_3 as Conversations }
export { _default_3 as TrConversations }

declare const _default_4: typeof _default_17 & {
    install: typeof install_3;
};
export { _default_4 as DropdownMenu }
export { _default_4 as TrDropdownMenu }

declare const _default_5: typeof _default_18 & {
    install: typeof install_4;
};
export { _default_5 as Feedback }
export { _default_5 as TrFeedback }

declare const _default_6: {
    install: <T>(app: App<T>) => void;
    name: string;
};
export { _default_6 as History }
export { _default_6 as TrHistory }

declare const _default_7: typeof _default_19 & {
    install: typeof install_5;
};
export { _default_7 as IconButton }
export { _default_7 as TrIconButton }

declare const _default_8: typeof _default_22 & {
    install: typeof install_6;
};
export { _default_8 as Sender }
export { _default_8 as TrSender }

declare const _default_9: typeof _default_23 & {
    install: typeof install_7;
};
export { _default_9 as TrWelcome }
export { _default_9 as Welcome }

export declare interface DropdownMenuEmits {
    (e: 'item-click', item: DropdownMenuItem): void;
}

export declare interface DropdownMenuEvents {
    itemClick?: (item: DropdownMenuItem) => void;
}

export declare interface DropdownMenuItem {
    id: string;
    text: string;
}

export declare interface DropdownMenuProps {
    items: DropdownMenuItem[];
    minWidth?: string | number;
    topOffset?: string | number;
}

export declare interface DropdownMenuSlots {
    default?: () => unknown;
}

export declare interface FeedbackEvents {
    (e: 'operation', name: string): void;
    (e: 'action', name: string): void;
}

export declare interface FeedbackProps {
    operations?: {
        name: string;
        label: string;
        onClick?: () => void;
    }[];
    operationsLimit?: number;
    actions?: {
        name: string;
        label: string;
        icon?: 'copy' | 'refresh' | 'like' | 'dislike' | VNode | Component;
        onClick?: () => void;
    }[];
    actionsLimit?: number;
    sources?: {
        label: string;
        link: string;
    }[];
    sourcesLinesLimit?: number;
}

export declare type HistoryData = HistoryItem[] | HistoryGroup[];

export declare interface HistoryEvents {
    (e: 'close'): void;
    (e: 'item-click', item: HistoryItem): void;
    (e: 'item-title-change', newTitle: string, rawData: HistoryItem): void;
    (e: 'item-delete', item: HistoryItem): void;
}

export declare interface HistoryGroup<T = Record<string, unknown>> {
    group: string | symbol;
    items: HistoryItem<T>[];
}

export declare interface HistoryItem<T = Record<string, unknown>> {
    id: string;
    title: string;
    tag?: HistoryItemTagProps;
    data?: T;
}

export declare interface HistoryItemTagProps {
    text: string;
    type?: 'success' | 'warning' | 'error' | 'info' | 'default';
    style?: CSSProperties;
}

export declare type HistoryProps = SingleTabHistoryProps | MultiTabHistoryProps;

export declare interface IconButtonProps {
    icon: VNode | Component;
    size?: string | number;
    svgSize?: string | number;
    rounded?: boolean;
}

export declare interface InputHandler {
    inputValue: Ref<string>;
    isComposing: Ref<boolean>;
    clearInput: () => void;
}

export declare type InputMode = 'single' | 'multiple';

declare const install: <T>(app: App<T>) => void;

declare const install_10: <T>(app: App<T>) => void;

declare const install_11: <T>(app: App<T>) => void;

declare const install_2: <T>(app: App<T>) => void;

declare const install_3: <T>(app: App<T>) => void;

declare const install_4: <T>(app: App<T>) => void;

declare const install_5: <T>(app: App<T>) => void;

declare const install_6: <T>(app: App<T>) => void;

declare const install_7: <T>(app: App<T>) => void;

declare const install_8: <T>(app: App<T>) => void;

declare const install_9: <T>(app: App<T>) => void;

declare const installPillButton: <T>(app: App<T>) => void;

declare const installPrompt: <T>(app: App<T>) => void;

declare const installPrompts: <T>(app: App<T>) => void;

export declare interface KeyboardHandler {
    handleKeyPress: (e: KeyboardEvent) => void;
    triggerSubmit: () => void;
}

export declare type MultiTabHistoryProps = {
    tabs: {
        title: string;
        id: string;
    }[];
    data: Record<string, HistoryData>;
} & BaseHistoryProps;

declare const Prompt: typeof _default_20 & {
    install: typeof installPrompt;
};
export { Prompt }
export { Prompt as TrPrompt }

export declare interface PromptProps {
    /**
     * 提示标签，显示提示的主要内容
     */
    label: string;
    /**
     * 唯一标识用于区分每个提示项，用于 Prompts 列表。如果不传此参数，则使用 index 作为 key
     */
    id?: string;
    /**
     * 提示描述，提供额外的信息
     */
    description?: string;
    /**
     * 提示图标，显示在提示项的左侧
     */
    icon?: VNode;
    /**
     * 是否禁用。默认 false
     */
    disabled?: boolean;
    /**
     * 提示徽章，显示在提示项的右上角
     */
    badge?: string | VNode;
}

declare const Prompts: typeof _default_21 & {
    install: typeof installPrompts;
};
export { Prompts }
export { Prompts as TrPrompts }

export declare interface PromptsEvents {
    (e: 'item-click', ev: MouseEvent, item: PromptProps): void;
}

export declare interface PromptsProps {
    /**
     * 包含多个提示项的列表
     */
    items: PromptProps[];
    /**
     * 自定义样式，用于各个提示项的不同部分
     */
    itemStyle?: string | CSSProperties;
    /**
     *  自定义类名，用于各个提示项的不同部分
     */
    itemClass?: string | string[];
    /**
     * 提示列表是否垂直排列。默认 false
     */
    vertical?: boolean;
    /**
     * 提示列表是否折行。默认 false
     */
    wrap?: boolean;
}

export declare interface PromptsSlots {
    footer?: () => unknown;
}

declare interface Question_2 {
    id: string;
    text: string;
    keywords?: string[];
}

/**
 * Question组件属性定义
 */
declare interface QuestionProps {
    /**
     * 问题分类列表
     * 包含多个分类，每个分类下有多个问题
     */
    categories: Category_2[];
    /**
     * 浮动显示的问题列表
     * 显示在组件底部的常见问题胶囊
     */
    commonQuestions: Question_2[];
    /**
     * 是否初始展开常见问题
     * @default false
     */
    initialExpanded?: boolean;
    /**
     * 弹窗宽度
     * @default '640px'
     */
    modalWidth?: string;
    /**
     * 主题类型
     * @default 'light'
     */
    theme?: ThemeType_3;
    /**
     * 是否点击外部关闭弹窗
     * @default true
     */
    closeOnClickOutside?: boolean;
    /**
     * 是否显示加载中状态
     * @default false
     */
    loading?: boolean;
}

export declare type SenderEmits = {
    (e: 'update:modelValue', value: string): void;
    (e: 'submit', value: string): void;
    (e: 'clear'): void;
    (e: 'speech-start'): void;
    (e: 'speech-end', transcript?: string): void;
    (e: 'speech-interim', transcript: string): void;
    (e: 'speech-error', error: Error): void;
    (e: 'suggestion-select', value: string): void;
    (e: 'focus', event: FocusEvent): void;
    (e: 'blur', event: FocusEvent): void;
    (e: 'escape-press'): void;
    (e: 'cancel'): void;
    (e: 'reset-template'): void;
};

export declare interface SenderProps {
    autofocus?: boolean;
    autoSize?: AutoSize;
    allowSpeech?: boolean;
    allowFiles?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    defaultValue?: string | null;
    loading?: boolean;
    modelValue?: string;
    mode?: InputMode;
    maxLength?: number;
    submitType?: SubmitTrigger;
    speech?: boolean | SpeechConfig;
    placeholder?: string;
    showWordLimit?: boolean;
    suggestions?: string[];
    theme?: ThemeType;
    template?: string;
    hasContent?: boolean;
    templateInitialValues?: Record<string, string>;
}

export declare type SingleTabHistoryProps = {
    tabTitle: string;
    data: HistoryData;
} & BaseHistoryProps;

export declare interface SpeechConfig {
    lang?: string;
    continuous?: boolean;
    interimResults?: boolean;
    autoReplace?: boolean;
}

export declare interface SpeechHandler {
    speechState: SpeechState;
    start: () => void;
    stop: () => void;
}

export declare interface SpeechHookOptions extends SpeechConfig {
    onStart?: () => void;
    onEnd?: (transcript?: string) => void;
    onInterim?: (transcript: string) => void;
    onFinal?: (transcript: string) => void;
    onError?: (error: Error) => void;
}

export declare interface SpeechState {
    isRecording: boolean;
    isSupported: boolean;
    error?: Error;
}

export declare type SubmitTrigger = 'enter' | 'ctrlEnter' | 'shiftEnter';

declare type SuggestionData = (SuggestionItem_2 | SuggestionGroup)[];

/**
 * 组件事件
 */
export declare interface SuggestionEmits {
    /** 双向绑定打开状态 (v-model) */
    (e: 'update:open', value: boolean): void;
    /** 选中指令项 */
    (e: 'select', value: string, context?: TriggerContext): void;
    /** 关闭面板 */
    (e: 'close'): void;
    /** 触发回调 */
    (e: 'trigger', handler: TriggerHandler): void;
    /** 选择分类 */
    (e: 'category-select', category: Category): void;
    /** 点击胶囊指令 */
    (e: 'suggestion-select', item: SuggestionItem): void;
    /** 展开/收起状态变化 */
    (e: 'update:expanded', expanded: boolean): void;
    /** 填充模板到输入框 */
    (e: 'fill-template', template: string): void;
}

declare interface SuggestionGroup {
    group: string;
    label: string;
    icon?: VNode | Component;
    items: SuggestionItem_2[];
}

/**
 * 指令项定义
 */
export declare interface SuggestionItem {
    /** 唯一标识 */
    id: string;
    /** 显示文本 */
    text: string;
    /** 指令值 */
    value: string;
    /** 图标 */
    icon?: VNode;
    /** 关键词，用于搜索和过滤 */
    keywords?: string[];
    /** 描述文本 */
    description?: string;
    /** 指令模板，用于在输入框中显示可编辑的模板 */
    template?: string;
}

declare interface SuggestionItem_2 {
    id: string;
    text: string;
}

export declare type SuggestionPillAction = {
    type: 'popover';
    props: SuggestionPopoverProps;
    slots?: Omit<SuggestionPopoverSlots, 'default'>;
    events?: SuggestionPopoverEvents;
} | {
    type: 'menu';
    props: DropdownMenuProps;
    events?: DropdownMenuEvents;
};

export declare type SuggestionPillBaseItem<T> = {
    id: string;
    action?: SuggestionPillAction;
} & T;

declare const SuggestionPillButton: typeof _default_26 & {
    install: typeof installPillButton;
};
export { SuggestionPillButton }
export { SuggestionPillButton as TrSuggestionPillButton }

export declare interface SuggestionPillButtonProps {
    item?: SuggestionPillItem;
}

export declare interface SuggestionPillButtonSlots {
    default?: () => unknown;
    icon?: () => unknown;
}

export declare type SuggestionPillItem<T = Record<string, unknown>> = SuggestionPillBaseItem<T> & ({
    text: string;
    icon?: VNode | Component;
} | {
    text?: string;
    icon: VNode | Component;
});

export declare interface SuggestionPillsEmits {
    (e: 'item-click', item: SuggestionPillItem): void;
}

export declare interface SuggestionPillsProps {
    items?: SuggestionPillItem[];
}

export declare interface SuggestionPillsSlots {
    default?: () => VNode | VNode[];
}

declare interface SuggestionPopoverEvents {
    itemClick?: (item: SuggestionItem_2) => void;
    groupClick?: (group: SuggestionGroup) => void;
    close?: () => void;
}

declare interface SuggestionPopoverProps {
    data: SuggestionData;
    title?: string;
    icon?: VNode | Component;
    /**
     * 是否显示弹窗，仅在 trigger 为 'manual' 时有效
     */
    show?: boolean;
    /**
     * 触发方式。默认值为 'click'
     */
    trigger?: 'click' | 'manual';
    /**
     * model:selectedGroup
     */
    selectedGroup?: string;
    groupShowMoreTrigger?: 'click' | 'hover';
    loading?: boolean;
    popoverWidth?: string | number;
    popoverHeight?: string | number;
    topOffset?: string | number;
}

declare interface SuggestionPopoverSlots {
    default?: () => unknown;
    loading?: () => unknown;
    empty?: () => unknown;
}

/**
 * 组件属性
 */
export declare interface SuggestionProps {
    /** 触发快捷键列表 */
    triggerKeys?: string[];
    /** 指令项列表 */
    items: SuggestionItem[];
    /** 分类列表 */
    categories?: Category[];
    /** 是否显示面板 (支持v-model) */
    open?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 主题，light或dark */
    theme?: 'light' | 'dark';
    /** 是否显示加载状态 */
    loading?: boolean;
    /** 是否点击外部关闭面板 */
    closeOnOutsideClick?: boolean;
    /** 面板标题 */
    title?: string;
    /** 最大显示条目数 */
    maxVisibleItems?: number;
    /** 默认是否展开完整指令列表 */
    defaultExpanded?: boolean;
}

/**
 * 模板编辑器事件
 */
export declare interface TemplateEditorEmits {
    /** 更新值 */
    (e: 'update:value', value: string): void;
    /** 输入事件 */
    (e: 'input', value: string): void;
    /** 内容变更状态 - 通知父组件是否有内容 */
    (e: 'content-status', hasContent: boolean): void;
    /** 提交事件 */
    (e: 'submit', value: string): void;
    /** 聚焦事件 */
    (e: 'focus', event: FocusEvent): void;
    /** 失焦事件 */
    (e: 'blur', event: FocusEvent): void;
}

/**
 * 模板编辑器暴露的方法
 */
export declare interface TemplateEditorExpose {
    /** 激活第一个可编辑字段 */
    activateFirstField: () => void;
    /** 重置所有字段 */
    resetFields: () => void;
    /** 聚焦编辑器并将光标置于末尾 */
    focus: () => void;
}

/**
 * 模板编辑器属性
 */
export declare interface TemplateEditorProps {
    /** 模板字符串，格式为普通文本与 [占位符] 的组合 */
    template: string;
    /** 当前值 */
    value?: string;
    /** 是否自动聚焦 */
    autofocus?: boolean;
    /** 字段初始值，键为占位符文本，值为初始内容 */
    initialValues?: Record<string, string>;
}

/**
 * 模板部分定义
 */
export declare interface TemplatePart {
    /** 内容文本 */
    content: string;
    /** 是否为可编辑字段 */
    isField: boolean;
    /** 占位符文本 (当字段为空时显示) */
    placeholder?: string;
    /** 字段索引 (用于标识可编辑字段) */
    fieldIndex?: number;
}

/**
 * 组件核心类型定义
 */
export declare type ThemeType = 'light' | 'dark';

declare type ThemeType_3 = 'light' | 'dark';

/**
 * 触发位置信息
 */
export declare interface TriggerContext {
    /** 触发的文本 */
    text: string;
    /** 触发的位置 */
    position: number;
}

/** 触发处理函数类型 */
export declare type TriggerHandler = (info: TriggerInfo) => void;

/** 触发信息类型 */
export declare type TriggerInfo = TriggerContext | false;

export declare interface WelcomeProps {
    title: string;
    description: string;
    align?: 'left' | 'center' | 'right' | string;
    icon?: VNode;
}

export declare interface WelcomeSlots {
    footer: () => unknown;
}

export { }
