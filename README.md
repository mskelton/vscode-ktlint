# ktlint

Format Kotlin files using ktlint.

## Requirements

- [ktlint](https://pinterest.github.io/ktlint/latest/install/cli/) must be
  installed and available in your PATH.

## Usage

Set ktlint as your default formatter for Kotlin files:

```json
{
  "[kotlin]": {
    "editor.defaultFormatter": "mskelton.ktlint"
  }
}
```

Then use VS Code's format command (`Shift+Alt+F` or `Shift+Option+F` on macOS)
to format your Kotlin files.
