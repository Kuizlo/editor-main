import { mergeAttributes, Node } from '@tiptap/core'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setPageBreak: {
      /**
       * Add a page break
       */
      setPageBreak: () => ReturnType
    }
  }
}

export default Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'umo-page-break',
        'data-line-number': false,
        'data-content': 'Page Break',
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[class*="umo-page-break"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain, state }) => {
          const { $to: $originTo } = state.selection
          const currentChain = chain()
          // If the cursor is at the beginning of a line, insert the page break before it
          if ($originTo.parentOffset === 0) {
            currentChain.insertContentAt(Math.max($originTo.pos - 2, 0), {
              type: this.name,
            })
          } else {
            // Otherwise, insert it at the current position
            currentChain.insertContent({
              type: this.name,
            })
          }
          return (
            currentChain
              // set cursor after page break
              .command(({ tr, dispatch }) => {
                if (dispatch) {
                  const { $to } = tr.selection
                  const posAfter = $to.end()

                  if ($to.nodeAfter) {
                    if ($to.nodeAfter.isTextblock) {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1))
                    } else if ($to.nodeAfter.isBlock) {
                      tr.setSelection(NodeSelection.create(tr.doc, $to.pos))
                    } else {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos))
                    }
                  } else {
                    // add node after page break if it’s the end of the document
                    const node =
                      $to.parent.type.contentMatch.defaultType?.create()

                    if (node) {
                      tr.insert(posAfter, node)
                      tr.setSelection(
                        TextSelection.create(tr.doc, posAfter + 1),
                      )
                    }
                  }

                  tr.scrollIntoView()
                }

                return true
              })
              .run()
          )
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.setPageBreak(),
    }
  },
})
