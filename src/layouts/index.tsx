import React from 'react';
import { Outlet, history, useLocation } from 'umi';
import styles from './index.less';
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import { Badge, TabBar, SafeArea } from 'antd-mobile';

export default function Layout() {
  const location = useLocation();
  const { pathname } = location;
  const tabs = [
    {
      key: '/home',
      title: '首页',
      icon: <AppOutline />
    },
    {
      key: '/docs',
      title: '待办',
      icon: <UnorderedListOutline />
    }
  ];

  return (
    <div className={styles.container}>
      <SafeArea position="top" />
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.tabbar}>
        <TabBar
          activeKey={pathname}
          onChange={(key) => {
            history.push(key);
          }}
        >
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      </div>
      <SafeArea position="bottom" />
    </div>
  );
}
