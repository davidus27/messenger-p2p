
// Function to split text into parts (text and links)
export const splitTextAndLinks = (text: string): Array<{ type: 'text' | 'link'; content: string }> => {

    // URL detection regex - matches http(s) and www URLs
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;

    const parts: Array<{ type: 'text' | 'link'; content: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        // Add text before the URL
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: text.slice(lastIndex, match.index)
            });
        }

        // Add the URL
        const url = match[0];
        parts.push({
            type: 'link',
            content: url.startsWith('www.') ? `https://${url}` : url
        });

        lastIndex = match.index + url.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push({
            type: 'text',
            content: text.slice(lastIndex)
        });
    }

    return parts;
};

export const processTextMessage = (message: string) => {
    // trim the newlines after the last character in the text
    // Trim trailing and leading newlines
    return message.trim();
};