import { spawn } from 'child_process'
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const formatter = vscode.languages.registerDocumentFormattingEditProvider(
    'kotlin',
    {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument,
      ): Promise<vscode.TextEdit[]> {
        const text = document.getText()

        return new Promise((resolve) => {
          const proc = spawn('ktlint', ['--stdin', '-F'])
          let stdout = ''
          let stderr = ''

          proc.stdout.on('data', (data: Buffer) => {
            stdout += data.toString()
          })

          proc.stderr.on('data', (data: Buffer) => {
            stderr += data.toString()
          })

          proc.on('close', (code) => {
            if (code !== 0) {
              vscode.window.showErrorMessage(
                `ktlint error: ${stderr || `exit code ${code}`}`,
              )
              resolve([])
              return
            }

            const fullRange = new vscode.Range(
              document.positionAt(0),
              document.positionAt(text.length),
            )

            resolve([vscode.TextEdit.replace(fullRange, stdout)])
          })

          proc.on('error', (error) => {
            vscode.window.showErrorMessage(`ktlint error: ${error.message}`)
            resolve([])
          })

          proc.stdin.write(text)
          proc.stdin.end()
        })
      },
    },
  )

  context.subscriptions.push(formatter)
}

export function deactivate() {}
