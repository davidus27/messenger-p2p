<script lang="ts">
    import {
        FloatingArrow,
        arrow,
        autoUpdate,
        flip,
        offset,
        useClick,
        useDismiss,
        useFloating,
        useInteractions,
        useRole,
    } from "@skeletonlabs/floating-ui-svelte";
    import { fade } from "svelte/transition";
    import BadgePlus from '@lucide/svelte/icons/badge-plus';
    
    // State
    let open = $state(false);
    let elemArrow: HTMLElement | null = $state(null);
    let friendId = $state("");
    
    function handleSubmit() {
        if (friendId.trim()) {
            // TODO: Handle friend ID submission
            console.log("Submitting friend ID:", friendId);
            open = false;
            friendId = "";
        }
    }
    
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleSubmit();
        }
    }
    
    // Use Floating
    const floating = useFloating({
        whileElementsMounted: autoUpdate,
        get open() {
            return open;
        },
        onOpenChange: (v) => {
            open = v;
        },
        placement: "top",
        get middleware() {
            return [offset(10), flip()];
        },
    });
    
    // Interactions
    const role = useRole(floating.context);
    const click = useClick(floating.context);
    const dismiss = useDismiss(floating.context);
    const interactions = useInteractions([role, click, dismiss]);
</script>

<div>
    <!-- Reference Element -->
    <button
        bind:this={floating.elements.reference}
        {...interactions.getReferenceProps()}
        class="btn-gradient"
    >
        Add Friend
    </button>

    <!-- Backdrop and Modal -->
    {#if open}
        <div
            class="fixed inset-0 bg-black/50 transition-opacity w-full h-full"
            transition:fade={{ duration: 200 }}
            onclick={() => open = false}
            role="presentation"
        >
            <div
                bind:this={floating.elements.floating}
                style={floating.floatingStyles}
                {...interactions.getFloatingProps()}
                class="bg-surface-50-900-token p-6 rounded-lg shadow-lg w-96"
                transition:fade={{ duration: 200 }}
                onclick={(e) => e.stopPropagation()}
            >
                <h2 class="text-xl font-bold mb-4">Add new friend</h2>
                <div class="mb-4">
                    <label for="friendId" class="block text-sm font-medium mb-2">Input their ID:</label>
                    <div class="flex gap-2">
                        <input
                            type="text"
                            id="friendId"
                            class="input w-full"
                            placeholder="Enter friend's ID"
                            bind:value={friendId}
                            onkeydown={handleKeydown}
                        />
                        <button
                            type="button"
                            class="btn variant-filled-primary"
                            onclick={handleSubmit}
                            aria-label="Submit friend ID"
                        >
                            <BadgePlus size={20} />
                        </button>
                    </div>
                </div>
                <p class="text-sm text-surface-600-400-token mt-4">
                    You can press the <kbd class="kbd">esc</kbd> key or click outside to
                    <strong>dismiss</strong> this dialog.
                </p>
            </div>
        </div>
    {/if}
</div>

<!-- <style>
    .fixed {
        position: fixed;
    }
    .inset-0 {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .bg-black\/50 {
        background-color: rgba(0, 0, 0, 0.5);
    }
    .left-1\/2 {
        left: 50%;
    }
    .top-1\/2 {
        top: 50%;
    }
    .-translate-x-1\/2 {
        transform: translateX(-50%);
    }
    .-translate-y-1\/2 {
        transform: translateY(-50%);
    }
    .w-96 {
        width: 24rem;
    }
    .mb-4 {
        margin-bottom: 1rem;
    }
    .mt-4 {
        margin-top: 1rem;
    }
    .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }
    .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
    .font-bold {
        font-weight: 700;
    }
    .font-medium {
        font-weight: 500;
    }
    .block {
        display: block;
    }
    .rounded-lg {
        border-radius: 0.5rem;
    }
    .shadow-lg {
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
    .p-6 {
        padding: 1.5rem;
    }
    .w-full {
        width: 100%;
    }
</style> -->