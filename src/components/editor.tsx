'use client';

import * as Y from 'yjs';

import { getRandomUser } from '@/utils/randomUser';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { useEffect } from 'react';
import { WebsocketProvider } from 'y-websocket';

export default function Editor() {
  const doc = new Y.Doc();

  const provider = new WebsocketProvider(
    process.env.NODE_ENV === 'production'
      ? 'wss://https://collaborative-editing-notes.gojiyuuniotorikudasai.com'
      : 'ws://localhost:3000',
    'my-roomname',
    doc
  );

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment('document-store'),
      user: getRandomUser(),
    },
  });

  const handleSaveData = async () => {
    const response = await fetch('/api/saveData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: editor.document }),
    });

    if (response.ok) {
      alert('Data saved successfully!');
    } else {
      alert('Something went wrong!');
    }
  };

  const fetchAllData = async () => {
    const response = await fetch('/api/getAllData');

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      alert('Failed to fetch data!');
    }
  };

  useEffect(() => {
    if (editor.document.length === 1) {
      (async () => {
        const allData: [] = await fetchAllData();
        const latestData: any = allData.at(-1);

        const items: [] = latestData.data;

        items.reverse().forEach((item: any) => {
          editor.insertBlocks(
            [
              {
                type: item.type,
                content: item.content.length === 0 ? '' : item.content[0].text,
              },
            ],
            editor.document[0]
          );
        });
      })();
    }
  }, [editor]);

  return (
    <>
      <BlockNoteView editor={editor} theme={'light'} />
      <button
        className="py-2 px-5 bg-gray-200 rounded"
        onClick={handleSaveData}
      >
        保存する
      </button>
    </>
  );
}
