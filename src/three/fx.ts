// Mutable singleton read by the post-processing Bloom each frame.
// Avoids re-rendering the React tree 60x/second just to tweak intensity.
export const fxState = {
  bloom: 1.0,
}
