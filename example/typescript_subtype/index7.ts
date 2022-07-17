enum TurnDirection {
  Left,
  Right,
}

function turnAngle(turn: TurnDirection): number {
  switch (turn) {
    case TurnDirection.Left:
      return -90;
    case TurnDirection.Right:
      return 90;
    default: {
      const result: never = fail("错误：未知方向！");
      return result;
    }
  }
}

function fail(message: string): never {
  console.error(message);
  throw new Error(message);
}
