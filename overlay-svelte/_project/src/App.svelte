<script>
  import { flip } from "svelte/animate";
  import { slide } from "svelte/transition";
  import Card from "./Card.svelte";
  import { scoreboard } from "./store";
</script>

<div class="cardContainer">
  {#each $scoreboard as card (card.contestant)}
    <div animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
      <div in:slide>
        <Card image={card.imageUrl} score={card.score}></Card>
      </div>
    </div>
  {/each}
</div>

<style>
  .cardContainer {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    align-items: end;
    gap: 1em;
  }
</style>
