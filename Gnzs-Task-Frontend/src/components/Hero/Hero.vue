<script setup lang="ts"></script>

<template>
    <div class="shape">
        <div />
        <div />
        <div />
    </div>

    <header>
        <div class="header-top">
            <slot name="header-top" />
        </div>
        <div class="header-bottom">
            <slot name="header-bottom" />
        </div>
    </header>
    <main>
        <slot name="content" />
    </main>
</template>

<style scoped>
.shape {
    overflow: clip;
    position: absolute;
    width: 100vw;
    height: 100vh;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    div:nth-child(2),
    div:nth-child(3) {
        background: var(--clr-brand-background-0);
    }

    div:nth-child(2) {
        /* ref: https://css-generators.com/triangle-shapes/ */
        /* border radius */
        --r: 50px;

        --mask: linear-gradient(90deg, #0000 calc(3 * var(--r) / 2), #000 0),
            radial-gradient(var(--r) at calc(2 * var(--r)) 50%, #000 98%, #0000 101%);
        aspect-ratio: cos(30deg);
        -webkit-mask: var(--mask);
        mask: var(--mask);
        clip-path: polygon(0 50%, 100% 100%, 100% 0);
        /* Fix for 1px seam between divs */
        transform: scale(1.01);
    }
}

.header-top,
.header-bottom {
    place-items: center;
}

header * {
    line-height: 1.5;
    font-size: var(--font-size-xxl);

    mix-blend-mode: difference;
    color: var(--clr-brand-accent);
}

header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .header-bottom {
        display: flex;
        align-items: flex-end;
    }
}

main > * {
    margin-left: auto;
}

@media (min-width: 512px) {
    header * {
        font-size: var(--font-size-xxxxl);
    }
}

@media (min-width: 1024px) {
    main {
        padding-left: 4rem;
    }
    main > * {
        margin-left: unset;
    }

    header {
        flex-direction: column;

        .header-top {
            display: flex;
            place-items: center;
            padding-right: calc(var(--section-gap) / 2);
        }

        .header-bottom {
            position: absolute;
            bottom: -10vh;
            left: 0;
        }
    }
}
</style>
