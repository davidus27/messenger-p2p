<script lang="ts">
    import LightSwitch from '$lib/components/LightSwitch.svelte';
	let mode: boolean = $state(false);
	const html = document.documentElement;

	// run effect whenever mode changes
	$effect(() => {
		html.classList.toggle('dark', !mode);
    });

</script>


<!-- button to toggle dark mode -->
<header class="fixed top-0 left-0 w-full z-50 shadow">
	<div class="flex-1 flex items-center gap-8 px-8 py-2">
		<nav>
			<a href="/" class="text-2xl font-bold">Chato</a>
		</nav>
		<span class="opacity-50">|</span>
		<p class="text-sm opacity-70">Chat with anyone, anywhere</p>
		<LightSwitch bind:mode={mode} />
	</div>
</header>
