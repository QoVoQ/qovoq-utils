const utils = require('../dist/qovoq-utils.umd')

describe('Method: fakeUID', () => {
  test('Unique', () => {
    const uid1 = utils.fakeUID()
    const uid2 = utils.fakeUID()

    expect(uid1).not.toBe(uid2)
  })
})

describe('Method: deepClone', () => {
  test('Copy nested object', () => {
    const original = {
      name: 'Tom',
      location: {x: 10}
    }

    const duplicate = utils.deepClone(original)

    expect(duplicate).toEqual(original)
    expect(duplicate).not.toBe(original)
  })
})

describe('Method: getDeepProperty', () => {
  const obj = {
    student: {
      major: {
        name: 'Maths',
        scores: [100]
      }
    }
  }

  expect(utils.getDeepProperty(obj, 'student.major.name')).toBe('Maths')
  expect(utils.getDeepProperty(obj, 'student.major.scores.0')).toBe(100)
  expect(utils.getDeepProperty(obj, 'student.major.scores.3.price')).toBe(null)
})

describe('Method: isEptVal', () => {
  expect(utils.isEptVal(null)).toBe(true)
  expect(utils.isEptVal('')).toBe(true)
  expect(utils.isEptVal(undefined)).toBe(true)
})

describe('Method: removeEptVal', () => {
  const input = {
    age: '',
    name: null,
    score: undefined,
    friends: 'Sally'
  }

  const output = {friends: 'Sally'}

  expect(utils.removeEptVal(input)).toEqual(output)
})

describe('Method: hasProperty', () => {
  expect(utils.hasProperty(null, 'a')).toBe(false)
  expect(utils.hasProperty({a: 1}, 'a')).toBe(true)
  expect(utils.hasProperty({b: 1}, 'a')).toBe(false)
})

describe('Method: normalizeNull', () => {
  expect(utils.normalizeNull(null)).toBe('')
  expect(utils.normalizeNull(undefined)).toBe('')
})

describe('Method: getBytesLen', () => {
  const str = 'Hello, 小明'
  expect(utils.getBytesLen(str)).toBe(11)
})

describe('Method: getQueryParam', () => {
  test('Get query value by key name', () => {
    const url = 'www.example.com/a/b#title?name=Tom&age=10&friends'
    expect(utils.getQueryParam('name', url)).toBe('Tom')
    expect(utils.getQueryParam('age', url)).toBe('10')
    expect(utils.getQueryParam('friends', url)).toBe('')
  })
})

describe('Method: shuffle', () => {
  test('Shuffle an array', () => {
    const arr = Array(10)
      .fill(0)
      .map((i, ii) => ii)
    expect(utils.shuffle(arr)).not.toEqual(arr)
  })
})
describe('Method: getRandomDayMils', () => {
  test('Get random millisecond in a day', () => {
    const millisecondInADay = 24 * 60 * 60 * 1000
    expect(utils.getRandomDayMils()).toBeLessThan(millisecondInADay)
  })
})

describe('Method: smartMerge', () => {
  test('Overwrite primitive value', () => {
    const oldObj = {
      name: 'Unknown'
    }

    const newObj = {
      name: 'Tom'
    }

    utils.smartMerge(oldObj, newObj)

    expect(oldObj).toEqual({
      name: 'Tom'
    })
  })
  test('Ignore undeclared value', () => {
    const oldObj = {
      name: 'Unknown'
    }

    const newObj = {
      age: 10
    }

    utils.smartMerge(oldObj, newObj)

    expect(oldObj).toEqual({
      name: 'Unknown'
    })
  })

  test('Nested object: Overwrite primitive value', () => {
    const oldObj = {
      location: {
        x: 0
      }
    }

    const newObj = {
      location: {
        x: 10
      }
    }

    utils.smartMerge(oldObj, newObj)

    expect(oldObj).toEqual({
      location: {
        x: 10
      }
    })
  })

  test('Nested object: Ignore undeclared value', () => {
    const oldObj = {
      location: {
        x: 0
      }
    }

    const newObj = {
      location: {
        y: 10
      }
    }

    utils.smartMerge(oldObj, newObj)

    expect(oldObj).toEqual({
      location: {
        x: 0
      }
    })
  })

  test('Copy Array', () => {
    const oldObj = {
      scores: [100, 98]
    }

    const newObj = {
      scores: [50, 59]
    }

    expect(utils.smartMerge(oldObj, newObj)).toEqual(newObj)
  })

  test('Copy Array: empty array', () => {
    const oldObj = {
      scores: []
    }

    const newObj = {
      scores: [50, 59]
    }

    expect(utils.smartMerge(oldObj, newObj)).toEqual(newObj)
  })
})
