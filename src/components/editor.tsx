'use client';

import * as Y from 'yjs';

import { getRandomUser } from '@/utils/randomUser';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
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

  return <BlockNoteView editor={editor} theme={'light'} />;
}
