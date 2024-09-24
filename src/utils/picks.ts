export function reorderPicks(oldPicks: any[], newPicks: any[]): any[] {
  const changedPicks = [];

  for (let i = 0; i < oldPicks.length; i++) {
    const oldPick = oldPicks[i];
    const newPick = newPicks[i];

    if (oldPick.guid != newPick.guid) {
      changedPicks.push({
        guid: newPick.guid,
        index: oldPicks.length - 1 - i,
      });
    }
  }

  return changedPicks;
}
