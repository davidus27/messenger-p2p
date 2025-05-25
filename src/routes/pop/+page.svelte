<script lang="ts">
    import Popover from '$lib/components/Popover.svelte'; 
    import { onMount } from 'svelte';
    
    function handleSubmit(event: CustomEvent) {
        const { friendId } = event.detail;
        console.log('Friend ID submitted:', friendId);
        // Handle the friend ID here
    }

    const isValid = (id: string) => {
        // check if it contains only numbers and -
        // if the id is 10 digits long, return true
        // otherwise return false
        return /^[0-9-]+$/.test(id) && id.length === 10;
    }

    const startsConnection = async (id: string) => {
        // wait for 5 second
        await new Promise(resolve => setTimeout(resolve, 5000));
        return false;
    }

    
    onMount(() => {
        document.addEventListener('submit', handleSubmit as EventListener);
        return () => {
            document.removeEventListener('submit', handleSubmit as EventListener);
        };
    });
</script>

<div class="flex justify-center items-center h-screen">
    <Popover {isValid} canConnect={startsConnection} />
</div>