/* ProseMirror */
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'

/* YJS */
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { schema } from './schema.js'
import "./App.css"

window.addEventListener('load', () => {
  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider('wss://demos.yjs.dev', 'prosemirror-demo', ydoc)
  const yXmlFragment = ydoc.getXmlFragment('prosemirror')

  const editor = document.createElement('div')
  editor.setAttribute('id', 'editor')
  const editorContainer = document.createElement('div')
  editorContainer.insertBefore(editor, null)
  const prosemirrorView = new EditorView(editor, {
    state: EditorState.create({
      schema,
      plugins: [
        ySyncPlugin(yXmlFragment),
        yCursorPlugin(provider.awareness),
        yUndoPlugin(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo
        })
      ].concat(exampleSetup({ schema }))
    })
  })
  document.body.insertBefore(editorContainer, null)

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = '연결끊기'
    }
  })

  // @ts-ignore
  window.example = { provider, ydoc, yXmlFragment, prosemirrorView }
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <button type="button" id="y-connect-btn">연결끊기</button>
      <p></p>
        <p>SW Jungle - Team Ansolomong</p>
        <p>코드에디터 : prosemirror</p>
        <a href="https://prosemirror.net/">Prose Mirror</a>
        <p>동시성 처리 CRDT: YJS - 코드에디터와 연동</p>
        <a href="https://github.com/yjs/y-prosemirror/">yjs with prosemirror</a>
        <p></p>
    </div>
  );
}

export default App;
