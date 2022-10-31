import { check } from '../../utils';

describe('SEQUENCES AND DELIMITERS', () => {
  test('Valid groups', () => {
    expect(check('(a+b)')).toMatchInlineSnapshot(`
      latex     = ["Delimiter", ["Add", "a", "b"]]
      box       = ["Add", "a", "b"]
      N-auto    = ["Add", 0, "a", "b"]
    `);
    expect(check('-(a+b)')).toMatchInlineSnapshot(`
      latex     = ["Negate", ["Delimiter", ["Add", "a", "b"]]]
      box       = ["Subtract", ["Negate", "b"], "a"]
      N-auto    = ["Add", 0, ["Negate", "a"], ["Negate", "b"]]
    `);
    expect(check('(a+(c+d))')).toMatchInlineSnapshot(`
      latex     = ["Delimiter", ["Add", "a", ["Delimiter", ["Add", "c", "d"]]]]
      box       = ["Add", "a", "c", "d"]
      N-auto    = ["Add", 0, "a", "c", "d"]
    `);
    expect(check('(a\\times(c\\times d))')).toMatchInlineSnapshot(`
      latex     = ["Delimiter", ["Multiply", "a", ["Delimiter", ["Multiply", "c", "d"]]]]
      box       = ["Multiply", "a", "c", "d"]
      N-auto    = ["Multiply", 1, "a", "c", "d"]
    `);
    expect(check('(a\\times(c+d))')).toMatchInlineSnapshot(`
      latex     = ["Delimiter", ["Multiply", "a", ["Delimiter", ["Add", "c", "d"]]]]
      box       = ["Multiply", "a", ["Add", "c", "d"]]
      N-auto    = ["Multiply", 1, "a", ["Add", 0, "c", "d"]]
    `);
    // Sequence with empty element
    expect(check('(a,,b)')).toMatchInlineSnapshot(`
      latex     = ["Delimiter", ["List", "a", "Nothing", "b"]]
      ["List", "a", "Nothing", "b"]
    `);
  });
  test('Groups', () => {
    expect(check('(a, b, c)')).toMatchInlineSnapshot(`
      latex     = ["Delimiter", ["List", "a", "b", "c"]]
      ["List", "a", "b", "c"]
    `);
    // @fixme
    expect(check('(a, b; c, d, ;; n ,, m)')).toMatchInlineSnapshot(`
      latex     = [
        "Delimiter",
        [
          "List",
          ["List", "a", "b"],
          [
            "List",
            "c",
            "d",
            [
              "Sequence",
              ["Error", "'missing'", ["Latex", "';'"]],
              "Nothing",
              ["List", "n", "Nothing", "m"]
            ]
          ]
        ]
      ]
      [
        "Delimiter",
        [
          "List",
          ["List", "a", "b"],
          [
            "List",
            "c",
            "d",
            [
              "Sequence",
              ["Error", "'missing'", ["Latex", "';'"]],
              "Nothing",
              ["List", "n", "Nothing", "m"]
            ]
          ]
        ]
      ]
    `);
    expect(check('(a, (b, c))')).toMatchInlineSnapshot(`
      latex     = ["Delimiter", ["List", "a", ["Delimiter", ["List", "b", "c"]]]]
      ["List", "a", ["List", "b", "c"]]
    `);
    expect(check('(a, (b; c))')).toMatchInlineSnapshot(`
      latex     = ["Delimiter", ["List", "a", ["Delimiter", ["List", "b", "c"]]]]
      ["List", "a", ["List", "b", "c"]]
    `);
  });
  test('Sequences', () => {
    expect(check('a, b, c')).toMatchInlineSnapshot(`
      latex     = ["Sequence", "a", "b", "c"]
      ["Sequence", "a", "b", "c"]
    `);
    // Sequence with missing element
    expect(check('a,, c')).toMatchInlineSnapshot(`
      latex     = ["Sequence", "a", "Nothing", "c"]
      ["Sequence", "a", "Nothing", "c"]
    `);
    // Sequence with missing final element
    expect(check('a,c,')).toMatchInlineSnapshot(`
      latex     = ["Sequence", "a", "c", "Nothing"]
      ["Sequence", "a", "c", "Nothing"]
    `);
    // Sequence with missing initial element
    expect(check(',c,b')).toMatchInlineSnapshot(`
      latex     = ["Sequence", ["Error", "'missing'", ["Latex", "','"]], "c", "b"]
      ["Sequence", ["Error", "'missing'", ["Latex", "','"]], "c", "b"]
    `); // @fixme: initial element should not be an error
  });
  test('Subsequences', () => {
    expect(check('a,b;c,d,e;f;g,h')).toMatchInlineSnapshot(`
      latex     = [
        "Sequence",
        ["List", "a", "b"],
        ["List", "c", "d", "ExponentialE"],
        "f",
        ["List", "g", "h"]
      ]
      [
        "Sequence",
        ["List", "a", "b"],
        ["List", "c", "d", "ExponentialE"],
        "f",
        ["List", "g", "h"]
      ]
    `);
    // @fixme
    expect(check(';;a;')).toMatchInlineSnapshot(`
      latex     = [
        "Sequence",
        ["Error", "'missing'", ["Latex", "';'"]],
        "Nothing",
        "a",
        "Nothing"
      ]
      [
        "Sequence",
        ["Error", "'missing'", ["Latex", "';'"]],
        "Nothing",
        "a",
        "Nothing"
      ]
    `);
  });
});
