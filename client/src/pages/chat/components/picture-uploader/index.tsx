import React, { useEffect, useState } from 'react';
import { Card, Image, Modal, Upload } from '@arco-design/web-react';
import { IconDelete, IconEye } from '@arco-design/web-react/icon';
import { UploadItem, UploadListProps } from '@arco-design/web-react/es/Upload';
import { v4 as uuidv4 } from 'uuid';

import styles from './index.module.scss';

interface Props {
  visible: boolean;
  closer: () => void;
  onSendMessageImage: (files: string[]) => unknown;
}

const loadFile = (file: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        const result = reader.result;
        if (result !== null) {
          resolve(result.toString());
        }
      },
      false
    );
    reader.readAsDataURL(file);
  });

const PictureUploader: React.FC<Props> = ({
  visible,
  closer,
  onSendMessageImage
}) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadItem[]>([]);

  const sendImages = async () => {
    const r: string[] = [];
    const len = selectedFiles.length;
    for (let i = 0; i < len; i++) {
      const item = selectedFiles[i];
      const blob = item.originFile?.slice();
      if (blob !== undefined) {
        const result = await loadFile(blob);
        r.push(result);
      }
    }
    onSendMessageImage(r);
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };

  const renderUploadList = (
    fileList: UploadItem[],
    uploadListProps: UploadListProps
  ) => (
    <div className={styles.previewOuter}>
      {fileList.map((file) => {
        const url
          = file.url || (file.originFile && URL.createObjectURL(file.originFile));
        return (
          <div key={file.uid} className={styles.previewItemOuter}>
            <Card
              key={file.uid}
              hoverable
              className={styles.previewItem}
              bodyStyle={{ padding: '4px 8px' }}
              cover={(
                <Image
                  src={url}
                  width={200}
                  height={200}
                  style={{ width: '200px', height: '200px' }}
                  alt='preview'
                />
              )}
              actions={[
                <div
                  key='预览'
                  onClick={() => {
                    Modal.info({
                      title: '预览',
                      content: <Image src={url} width='100%' alt='preview' />
                    });
                  }}
                >
                  <IconEye style={{ fontSize: 12 }} />
                </div>,
                <div key='移除'>
                  <IconDelete
                    style={{ fontSize: 12 }}
                    onClick={() => {
                      uploadListProps?.onRemove?.(file);
                    }}
                  />
                </div>
              ]}
            >
            </Card>
          </div>
        );
      })}
    </div>
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const watchPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.files || [];
      console.log(items[0]);
      if (items[0]) {
        const file = items[0];
        if (file.type.startsWith('image')) {
          setSelectedFiles((prev) => {
            return [...prev, {
              uid: uuidv4(),
              originFile: file
            }];
          });
        }
      }

      // for (let i = 0; i < items.length; i++) {
      //   const item = items[i];

      //   // 检查是否是图片
      //   if (item.kind === 'file' && item.type.startsWith('image/')) {
      //     const file = item.getAsFile();
      //     const reader = new FileReader();

      //     reader.onload = (event) => {
      //       const img = document.createElement('img');
      //       img.src = event.target.result; // 设置图片的源为读取的结果
      //       document.body.appendChild(img); // 将图片添加到页面
      //     };

      //     reader.readAsDataURL(file); // 读取文件为 Data URL
      //     break; // 处理完第一条后退出循环
      //   }
      // }
    };
    document.addEventListener('paste', watchPaste);
    return () => {
      document.removeEventListener('paste', watchPaste);
    };
  }, []);

  return (
    <Modal
      title='发送图片'
      visible={visible}
      className={styles.modal}
      confirmLoading={loading}
      wrapClassName={styles.modalWrapper}
      onOk={async () => {
        setLoading(true);
        await sendImages();
        setLoading(false);
        clearSelectedFiles();
        closer();
      }}
      onCancel={() => {
        clearSelectedFiles();
        closer();
      }}
    >
      <Upload
        multiple
        autoUpload={false}
        fileList={selectedFiles}
        onChange={(fileList) => {
          // console.log(fileList, file);
          setSelectedFiles(fileList);
        }}
        renderUploadList={renderUploadList}
        style={{ width: '100%' }}
      >
        <div className={styles.trigger}>
          <div>
            Drag the file here or
            <span style={{ color: '#3370FF', padding: '0 4px' }}>
              Click to upload
            </span>
          </div>
        </div>
      </Upload>
    </Modal>
  );
};

export default PictureUploader;
