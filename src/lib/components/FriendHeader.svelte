<script lang="ts">
    export let people: string[] = [];
	export let currentPersonId: string;

    const getCurrentPerson = (): string => {
		if (currentPersonId === undefined) {
			return 'Unknown';
		}
		return people.find((person) => person === currentPersonId) ?? 'Noone';
	};
</script>

<div class="p-5">
    <p class="font-bold">Chat with {getCurrentPerson()}</p>
</div>