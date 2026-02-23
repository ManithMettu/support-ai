## Packages
react-markdown | For rendering assistant responses with markdown support
remark-gfm | For markdown tables and strikethrough support

## Notes
- Expecting a clean minimal design style with Geist font.
- Session IDs are generated on the client via `crypto.randomUUID()` and stored in `localStorage`.
- Chat queries might return 404 if a local session hasn't been created on the server yet; the frontend handles this by defaulting to an empty message list.
- Markdown requires `@tailwindcss/typography` which is already in the base stack.
