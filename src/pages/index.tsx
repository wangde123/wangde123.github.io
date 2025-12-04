import React, { useCallback, useEffect, useState } from 'react';
import { Swiper, Image, Toast, Dialog, Space } from 'antd-mobile';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
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

// Client-side image compression to improve upload speed
async function compressImage(file: File, maxDim = 1280, quality = 0.8): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  const type = file.type.includes('png') ? 'image/png' : 'image/jpeg';
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob || file), type, quality);
  });
}

export default function HomePage() {
  const [slides, setSlides] = useState<{ image: string; id: number; title: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const run = async () => {
    setLoading(true);
    const prefix = 'uploads';
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(prefix, {
        limit: 20,
        offset: 0,
        sortBy: { column: 'name', order: 'desc' },
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
          image: supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${prefix}/${item.name}`).data.publicUrl,
          id: index,
          title: item.name
        }
      }

      );
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
      {loading && (
        <div className={styles.skeleton} />
      )}
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
