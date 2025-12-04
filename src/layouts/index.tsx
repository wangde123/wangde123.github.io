import React, { useState } from 'react'
import { Link, Outlet } from 'umi';
import styles from './index.less';
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { Badge, TabBar, SafeArea } from 'antd-mobile'

export default function Layout() {
   const tabs = [
    {
      key: 'home',
      title: '首页',
      icon: <AppOutline />,
      badge: Badge.dot,
    },
    {
      key: 'todo',
      title: '待办',
      icon: <UnorderedListOutline />,
      badge: '5',
    },
    {
      key: 'message',
      title: '消息',
      icon: (active: boolean) =>
        active ? <MessageFill /> : <MessageOutline />,
      badge: '99+',
    },
    {
      key: 'personalCenter',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  const [activeKey, setActiveKey] = useState('todo')
  return (
    <div className={styles.container}>
      <SafeArea position='top' />
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.tabbar}>
        <SafeArea position='top' />
        <TabBar>
          {tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
        <SafeArea position='bottom' />
      </div>
    </div>
  );
}
