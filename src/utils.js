// Thanks to user Mitya on StackOverflow (https://stackoverflow.com/questions/61137952/i-have-two-matching-arrays-how-can-i-pair-the-values-without-two-same-values-be)
export const makePairs = (players) => {
  // Make hat from players and shuffle.
  let hat = [...players]
  hat.sort(() => Math.floor(Math.random() * 2))

  // For each player pull a name.
  let pairs = players.map(picker => {
    // Pick off the "top", unless its the picker, then pick the next one
    let hatIdx = hat[0] !== picker ? 0 : 1
    let choice = hat[hatIdx]
    // If there is no "next one", pick self
    if (!choice) choice = picker
    // Remove name from hat
    hat.splice(hatIdx, 1)
    return { santa: picker, recipient: choice }
  })

  // Check if the final pair is same user, swap first and last recipients if so.
  let final_pair = pairs[pairs.length-1];
  if (final_pair.santa === final_pair.recipient) {
    let tmp = final_pair.recipient
    final_pair.recipient = pairs[0].recipient
    pairs[0].recipient = tmp
  }

  return pairs
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}