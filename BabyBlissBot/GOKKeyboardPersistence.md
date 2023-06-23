# GOK Keyboard Persistence

## GOK Keyboard Elements

GOK keyboard files are expressed using xml, and have the extension '.kbd'.

The main elements are:

- `GokFile`
  - defines the `GOK` XML namespace `http://www.gnome.org/GOK`
- `keyboard`
  - container of a collection of `key` elements
  - `name` attribute
  - `commandprediction` attribute, (boolean?)
  - `wordcompletion` attribute, (boolean?)
- `key`
  - provides characteristics of a single key.
  - attributes `left`, `right`, `top`, and `bottom` specify position in terms of columns and rows.
  - attribute `type`, an enum:

      ```
      { normal, branch, branchBack, branchWindows, settings, modifier }
      ```
  - attribute `modifier`, used if the `type=modifier`.  An enum: 
    ```
    { shift, ctrl, alt, capslock, mod4 }
    ```
  - attribute `modifierType`, optional and, if used, the `type=modifier` must be present.  The only value appears to be `toggle`.  A full example:  `<key type="modifier" modifier="capslock" modifierType="toggle">...</key>`
- `label`
  - must be nested within a `key` element
  - provides a label for the key, a human facing UI string.
- `output`
  - optional; must be nested within a `key` element.
  - defines any output caused by invoking the key.
  - attribute `type`.  Possible values are `{ keysym, keycode }`.
  - contents of the element is the output value, e.g., "comma".

## Example Using JSON
This is a guess on how a GOK XML keyboard file could be repurposed using JSON instead of XML, where the names of the JSON fields are the same as the XML elements and their attributes.

Two possibilities with respect to the collection of keys are an array of key structures or a set of named keys.  In the first case, the `key` element is lost, but its structure is captured as a list of "anonymous" keys.

```
"keyboard": {
    "name": "manage",
    "commandprediction": false,
    "wordcompletion": false,
    "keys": [{
            "left": 0,
            "right": 1,
            "top": 0,
            "bottom": 1,
            "type": "branchBack",
            "label": "back"
        },
        {
            "left": 1,
            "right": 2,
            "top": 0,
            "bottom": 1,
            "type": "branchWindows",
            "label": "Activate Window"
        },
        {
            "left": 2,
            "right": 3,
            "top": 0,
            "bottom": 1,
            "type": "settings",
            "label": "Settings"
        },
        {
            "left": 0,
            "right": 1,
            "top": 1,
            "bottom": 2,
            "type": "normal",
            "label": "Gok"
        },
        {
            "left": 1,
            "right": 2,
            "top": 1,
            "bottom": 2,
            "type": "normal",
            "label": "Other"
        },
        {
            "left": 2,
            "right": 3,
            "top": 1,
            "bottom": 2,
            "type": "normal",
            "label": "Pointer"
        }
    ]
}
```

In the second case, the `key` element is again missing, but each key has a unique id.  The array is replaced with a `keys` block containing a set of key ids.  For illustrative purposes the id is based on the key's label:

```
{
    "keyboard": {
        "name": "manage",
        "commandprediction": false,
        "wordcompletion": false,
        "keys": {
            "back": {
                "left": 0,
                "right": 1,
                "top": 0,
                "bottom": 1,
                "type": "branchBack",
                "label": "back"
            },
            "activateWindow": {
                "left": 1,
                "right": 2,
                "top": 0,
                "bottom": 1,
                "type": "branchWindows",
                "label": "Activate Window"
            },
            "settings": {
                "left": 2,
                "right": 3,
                "top": 0,
                "bottom": 1,
                "type": "settings",
                "label": "Settings"
            },
            "gok": {
                "left": 0,
                "right": 1,
                "top": 1,
                "bottom": 2,
                "type": "normal",
                "label": "Gok"
            },
            "other": {
                "left": 1,
                "right": 2,
                "top": 1,
                "bottom": 2,
                "type": "normal",
                "label": "Other"
            },
            "pointer": {
                "left": 2,
                "right": 3,
                "top": 1,
                "bottom": 2,
                "type": "normal",
                "label": "Pointer"
            }
        }
    }
}
```