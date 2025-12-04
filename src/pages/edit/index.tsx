import React, { useCallback, useEffect, useState } from 'react';
import { NavBar, Toast, ImageUploader, Dialog } from 'antd-mobile';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { history } from 'umi';
import { createClient } from '@supabase/supabase-js';
import styles from './index.less';

// Inline Supabase client (env-free)
const supabase = createClient(
  'https://tuiwsyyxhzhjonchrtps.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1aXdzeXl4aHpoam9uY2hydHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDc3NjQsImV4cCI6MjA4MDMyMzc2NH0.6izd1nRzDu3FUc7Yx08W_-MN05l21uVy1sbe13Np3kA'
);
const BUCKET_NAME = 'photos';

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

const pathFromPublicUrl = (u: string) =>
  decodeURIComponent(u.replace(/^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\//, ''));

export default function EditPage() {
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const run = async () => {
    const prefix = 'uploads';
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(prefix, {
        limit: 20,
        offset: 0,
        sortBy: { column: 'name', order: 'desc' },
      });
    if (error) {
      Toast.show({ content: '获取图片列表失败', duration: 2000, icon: 'fail' });
      return;
    }
    const urls = (data || [])
      .filter((item) => item.name)
      .map((item) =>
        supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${prefix}/${item.name}`).data.publicUrl,
      );
    setFileList(urls.map((u) => ({ url: u })));
  };
  useEffect(() => {

    run();
  }, []);

  const upload = useCallback(async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const compressed = await compressImage(file);
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, compressed, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      Toast.show({ content: '上传失败，请稍后重试', duration: 2000, icon: 'fail' });
      throw error;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    Toast.show({ content: '上传成功', duration: 1500, icon: 'success' });
    // Controlled ImageUploader will append the returned item automatically via onChange
    return { url: data.publicUrl };
  }, []);

  const onDelete = async (item: ImageUploadItem) => {
    const confirmed = await Dialog.confirm({ content: '是否确认删除' });
    if (!confirmed) return false;
    const url = item.url as string | undefined;
    if (!url) return false;
    const path = pathFromPublicUrl(url);
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) {
      Toast.show({ content: '删除失败', duration: 2000, icon: 'fail' });
      return false;
    }
    Toast.show({ content: '已删除', duration: 1500, icon: 'success' });
    setFileList((prev) => prev.filter((i) => i.url !== url));
    return true;
  };

  return (
    <div className={styles.editContainer}>
      <NavBar onBack={() => history.push('/')} style={{background:"#fff"}}>图片编辑</NavBar>
      <div className={styles.body}>
        <ImageUploader value={fileList} onChange={setFileList} upload={upload} onDelete={onDelete} maxCount={5} />
      </div>
    </div>
  );
}
