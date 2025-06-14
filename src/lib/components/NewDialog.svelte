<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
    import Plus from '@lucide/svelte/icons/plus';


    let DialogRef: Dialog | null = null;

</script>



<Dialog bind:this={DialogRef}>

</Dialog>


<!-- Interface -->
<div class="flex items-center justify-center">
	<!-- Trigger -->
	<button
		class="btn preset-filled"
		onclick={() => DialogRef?.openDialog()}
	>
		<Plus /> Add Text
	</button>
</div>

