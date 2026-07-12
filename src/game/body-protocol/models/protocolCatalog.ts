import { Protocol } from './protocol'

export const PROTOCOL_CATALOG: Protocol[] = [
  { id: 'protocol_edge_three', title: 'THREE INTERRUPTIONS', theme: 'edge_control', rules: ['release_requires_permission', 'minimum_edge_count_3'], modifiers: { controlDecayMultiplier: 1.15, anticipatoryResponseGain: 1.2 }, specialRule: 'echo_has_one_resistance_token' },
  { id: 'protocol_zone_rotation', title: 'ROTATING SIGNALS', theme: 'zone_rotation', rules: ['change_zone_after_each_peak', 'no_route_twice_in_a_row'], modifiers: { controlDecayMultiplier: 1.05, anticipatoryResponseGain: 1.1 }, specialRule: 'the_warm_zone_is_not_always_the_next_zone' },
  { id: 'protocol_command_dependency', title: 'COMMAND / RESPONSE', theme: 'command_dependency', rules: ['commands_require_acknowledgement', 'silence_counts_as_a_signal'], modifiers: { controlDecayMultiplier: 1.1, anticipatoryResponseGain: 1.25 }, specialRule: 'echo_may_withhold_the_next_instruction' },
]

export function protocolForSeed(seed: string): Protocol {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PROTOCOL_CATALOG[hash % PROTOCOL_CATALOG.length]
}
