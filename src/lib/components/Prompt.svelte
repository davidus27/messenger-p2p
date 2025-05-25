<script lang="ts">
    import IconSend from '@lucide/svelte/icons/send-horizontal';

    export let textareaElement: HTMLTextAreaElement;
    export let currentMessage: string;
    export let sendNewMessage: () => void;

    const autoResizeTextarea = () => {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = textareaElement.scrollHeight + 'px';
		}
	};

    function onPromptKeydown(event: KeyboardEvent) {
		// if shift and enter is pressed, it's a new line
		if (event.shiftKey && event.code === 'Enter') {
			return;
		}
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			sendNewMessage();
		}
	}

</script>

<section class="border-surface-200-800 border-t-[1px] p-5">
    <div
        class="input-group divide-surface-200-800 rounded-container-token grid-cols-[auto_1fr_auto] divide-x"
    >
        <button class="input-group-cell preset-tonal p-3">+</button>
        <textarea
            bind:this={textareaElement}
            bind:value={currentMessage}
            class="resize-none border-0 bg-transparent ring-0 p-3"
            name="prompt"
            id="prompt"
            placeholder="Write a message..."
            rows="1"
            on:keydown={onPromptKeydown}
            on:input={autoResizeTextarea}
        ></textarea>
        <button
            class="input-group-cell {currentMessage ? 'preset-filled-primary-500' : 'preset-tonal'}"
            on:click={sendNewMessage}
        >
            <IconSend />
        </button>
    </div>
</section>