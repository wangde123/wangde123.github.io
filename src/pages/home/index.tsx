import React, { useEffect, useState } from 'react';
import { Swiper, Image, Toast } from 'antd-mobile';
import { AddCircleOutline } from 'antd-mobile-icons';
import { createClient } from '@supabase/supabase-js';
import styles from './index.less';
import { history } from 'umi';

// Inline Supabase client (env-free)
const supabase = createClient(
  'https://tuiwsyyxhzhjonchrtps.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1aXdzeXl4aHpoam9uY2hydHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDc3NjQsImV4cCI6MjA4MDMyMzc2NH0.6izd1nRzDu3FUc7Yx08W_-MN05l21uVy1sbe13Np3kA'
);

const BUCKET_NAME = 'photos';

export default function HomePage() {
  const [slides, setSlides] = useState<Array<{ image: string; id: number; title: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const run = async () => {
    setLoading(true);
    const prefix = 'uploads';
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(prefix, {
      limit: 20,
      offset: 0,
      sortBy: { column: 'name', order: 'desc' }
    });
    if (error) {
      setLoading(false);
      console.error('[Supabase list error]', error.message);
      Toast.show({ content: '获取图片列表失败', duration: 2000, icon: 'fail' });
      return;
    }
    const urls = (data || [])
      .filter((item) => item.name)
      .map((item, index) => {
        return {
          image: supabase.storage.from(BUCKET_NAME).getPublicUrl(`${prefix}/${item.name}`).data.publicUrl,
          id: index,
          title: item.name
        };
      });
    setSlides(urls);
    setLoading(false);
    console.log('[Supabase photos]', urls);
  };
  useEffect(() => {
    run();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <AddCircleOutline className={styles.out_line} fontSize={25} onClick={() => history.push('/edit')} />
      {loading && <div className={styles.skeleton} />}
      {!loading && (
        <Swiper autoplay loop autoplayInterval={3000}>
          {slides.map((slide) => (
            <Swiper.Item key={slide.id}>
              <div className={styles.swiperItem}>
                <Image src={slide.image} alt={slide.title} className={styles.swiperImage} />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      )}
    </div>
  );
}
