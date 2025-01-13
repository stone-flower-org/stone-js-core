// TODO: write unit tests

export const insertTextInInput = (input: HTMLInputElement | HTMLTextAreaElement, text: string) => {
  const start = input.selectionStart ?? 0;
  const end = input.selectionEnd ?? 0;

  // Insert spaces at the cursor position
  input.value = input.value.slice(0, start) + text + input.value.slice(end);

  // Move cursor to the end of the inserted spaces
  input.selectionStart = input.selectionEnd = start + text.length;
};
