import { h } from 'vue';
import { IconAi, IconUser } from '@opentiny/tiny-robot-svgs';
const aiAvatar = h(IconAi, { style: { fontSize: '32px' } });
const userAvatar = h(IconUser, { style: { fontSize: '32px' } });

// 定义角色图标以及样式
export const roles = {
  assistant: {
    placement: 'start',
    avatar: aiAvatar,
    maxWidth: '90%',
    type: 'markdown',
    mdConfig: { html: true },
  },
  user: {
    placement: 'end',
    avatar: userAvatar,
    maxWidth: '90%',
    type: 'markdown',
    mdConfig: { html: true },
  },
};

export const promptItems = [
  // {
  //   label: '列出工具',
  //   description: '列出目前系统中可用的工具！',
  //   icon: h('span', { style: { fontSize: '18px' } }, '🧠'),
  //   badge: 'NEW',
  // },
  // {
  //   label: '界面操作',
  //   description: '通过界面新增用户 张三 男 2000-1-1',
  //   icon: h('span', { style: { fontSize: '18px' } }, '🧠'),
  //   badge: 'NEW',
  // },
  // {
  //   label: '函数调用',
  //   description: '新增用户 李四 女 2000-2-2',
  //   icon: h('span', { style: { fontSize: '18px' } }, '🧠'),
  //   badge: 'NEW',
  // },
];
