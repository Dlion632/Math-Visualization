window.NOTES_CONTENT = {
  "site": {
    "brand": "Sine Notes",
    "statusLabel": "Connected",
    "pageTitle": "Documentation",
    "eyebrow": "OVERVIEW",
    "documentTitle": "Deriving Sine from Circle Motion"
  },
  "accentTerms": [
    "sine",
    "cosine",
    "radians",
    "arc length",
    "unit circle",
    "vertical coordinate",
    "circular motion",
    "nonlinear",
    "differential equations",
    "integral equations"
  ],
  "sections": [
    {
      "id": "1-starting-from-a-point-outside-the-circle",
      "title": "1. Starting from a point outside the circle",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Suppose we have a circle with center \\(C\\) and an arbitrary point \\(M\\) somewhere outside or inside the circle."
        },
        {
          "type": "paragraph",
          "text": "Our first problem is not yet sine. We simply want to answer:"
        },
        {
          "type": "quote",
          "text": "In what direction is the point \\(M\\) from the center \\(C\\)?"
        },
        {
          "type": "paragraph",
          "text": "To describe that direction, we need the displacement from \\(C\\) to \\(M\\)."
        },
        {
          "type": "paragraph",
          "text": "If"
        },
        {
          "type": "equation",
          "latex": "C+d=M",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "then solving for the missing movement \\(d\\) gives"
        },
        {
          "type": "equation",
          "latex": "\\boxed{d=M-C}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "The subtraction here should be understood geometrically. We are asking what movement must be added to \\(C\\) in order to arrive at \\(M\\)."
        },
        {
          "type": "paragraph",
          "text": "Therefore \\(d\\) is the vector starting at the center and pointing toward \\(M\\)."
        },
        {
          "type": "paragraph",
          "text": "If"
        },
        {
          "type": "equation",
          "latex": "C=(C_x,C_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "and"
        },
        {
          "type": "equation",
          "latex": "M=(M_x,M_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "then"
        },
        {
          "type": "equation",
          "latex": "d=(M_x-C_x,\\;M_y-C_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "So the vector contains both the horizontal and vertical movement required to travel from the center to the point."
        }
      ]
    },
    {
      "id": "2-the-displacement-contains-direction-and-distance",
      "title": "2. The displacement contains both direction and distance",
      "blocks": [
        {
          "type": "paragraph",
          "text": "The vector"
        },
        {
          "type": "equation",
          "latex": "d=(d_x,d_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "does not describe only a direction. It also contains a length."
        },
        {
          "type": "paragraph",
          "text": "Its magnitude is"
        },
        {
          "type": "equation",
          "latex": "|d|=\\sqrt{d_x^2+d_y^2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "This tells us how far \\(M\\) is from the center."
        },
        {
          "type": "paragraph",
          "text": "Therefore two points lying in exactly the same direction from the center can produce different displacement vectors. One point may be closer and another farther away, even though both vectors point in the same direction."
        },
        {
          "type": "paragraph",
          "text": "For circular motion we often want to keep the direction while removing this arbitrary distance."
        },
        {
          "type": "paragraph",
          "text": "That is the purpose of **vector normalization**."
        }
      ]
    },
    {
      "id": "3-what-normalization-is-trying-to-do",
      "title": "3. What normalization is trying to do",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Suppose"
        },
        {
          "type": "equation",
          "latex": "d=(d_x,d_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "has length \\(|d|\\)."
        },
        {
          "type": "paragraph",
          "text": "We want to construct another vector pointing in exactly the same direction, but whose length is always"
        },
        {
          "type": "equation",
          "latex": "1",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Call this new vector \\(u\\)."
        },
        {
          "type": "paragraph",
          "text": "To remove the original length, divide the entire vector by its magnitude:"
        },
        {
          "type": "equation",
          "latex": "\\boxed{u=\\frac{d}{|d|}}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "Component by component,"
        },
        {
          "type": "equation",
          "latex": "u=\\left(\\frac{d_x}{|d|},\\frac{d_y}{|d|}\\right)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "This operation is called **vector normalization**."
        },
        {
          "type": "paragraph",
          "text": "Normalization does not change where the vector points. It changes only its length."
        }
      ]
    },
    {
      "id": "4-why-dividing-by-the-magnitude-makes-the-length-one",
      "title": "4. Why dividing by the magnitude makes the length equal to one",
      "blocks": [
        {
          "type": "paragraph",
          "text": "We defined the normalized vector as"
        },
        {
          "type": "equation",
          "latex": "u=\\frac{d}{|d|}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "It is tempting to jump immediately to \\(|u|=|d|/|d|=1\\), but that shortcut already assumes a rule about how vector length behaves when a vector is divided by a number. We have not proved that rule yet, so we will calculate the new length directly from the components."
        },
        {
          "type": "paragraph",
          "text": "Write the original displacement vector as"
        },
        {
          "type": "equation",
          "latex": "d=(d_x,d_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Its magnitude is found from the Pythagorean theorem:"
        },
        {
          "type": "equation",
          "latex": "|d|=\\sqrt{d_x^2+d_y^2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Dividing the vector by its magnitude means dividing each coordinate by the same number:"
        },
        {
          "type": "equation",
          "latex": "u=\\left(\\frac{d_x}{|d|},\\frac{d_y}{|d|}\\right)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Now forget the normalization shortcut for a moment. Treat this as an ordinary vector and calculate its magnitude using the same magnitude formula:"
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{\\left(\\frac{d_x}{|d|}\\right)^2+\\left(\\frac{d_y}{|d|}\\right)^2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Squaring each fraction gives"
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{\\frac{d_x^2}{|d|^2}+\\frac{d_y^2}{|d|^2}}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Both terms have the same denominator, so we can combine them:"
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{\\frac{d_x^2+d_y^2}{|d|^2}}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "But from the definition of the original magnitude,"
        },
        {
          "type": "equation",
          "latex": "|d|=\\sqrt{d_x^2+d_y^2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Squaring both sides gives"
        },
        {
          "type": "equation",
          "latex": "|d|^2=d_x^2+d_y^2",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "So the numerator \\(d_x^2+d_y^2\\) is exactly the same quantity as \\(|d|^2\\). Substitute that into the previous expression:"
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{\\frac{|d|^2}{|d|^2}}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "For any nonzero displacement vector, \\(|d|\\neq 0\\), so the fraction is"
        },
        {
          "type": "equation",
          "latex": "\\frac{|d|^2}{|d|^2}=1",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Therefore"
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{1}",
          "important": false
        },
        {
          "type": "equation",
          "latex": "\\boxed{|u|=1}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "So the length becomes one because, after recalculating the magnitude from the normalized coordinates, the same quantity appears in both the numerator and denominator and cancels."
        },
        {
          "type": "paragraph",
          "text": "Now take a concrete example. Suppose"
        },
        {
          "type": "equation",
          "latex": "d=(3,4)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "First calculate its magnitude:"
        },
        {
          "type": "equation",
          "latex": "|d|=\\sqrt{3^2+4^2}",
          "important": false
        },
        {
          "type": "equation",
          "latex": "|d|=\\sqrt{9+16}",
          "important": false
        },
        {
          "type": "equation",
          "latex": "|d|=\\sqrt{25}=5",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "So the original vector \\(d=(3,4)\\) has length \\(5\\). Normalize it by dividing both coordinates by \\(5\\):"
        },
        {
          "type": "equation",
          "latex": "u=\\left(\\frac{3}{5},\\frac{4}{5}\\right)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Now calculate the magnitude of this new vector from scratch:"
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{\\left(\\frac{3}{5}\\right)^2+\\left(\\frac{4}{5}\\right)^2}",
          "important": false
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{\\frac{9}{25}+\\frac{16}{25}}",
          "important": false
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{\\frac{25}{25}}",
          "important": false
        },
        {
          "type": "equation",
          "latex": "|u|=\\sqrt{1}=1",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "The original vector \\(d=(3,4)\\) had length \\(5\\). After dividing both coordinates by that length, the new vector \\(u=(3/5,4/5)\\) still has the same \\(3:4\\) component proportion, so it points in the same direction, but its magnitude is exactly \\(1\\)."
        }
      ]
    },
    {
      "id": "5-normalization-places-the-direction-on-the-unit-circle",
      "title": "5. Normalization places the direction on the unit circle",
      "blocks": [
        {
          "type": "paragraph",
          "text": "After normalization,"
        },
        {
          "type": "equation",
          "latex": "u=(u_x,u_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "and"
        },
        {
          "type": "equation",
          "latex": "|u|=1",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Using the magnitude formula,"
        },
        {
          "type": "equation",
          "latex": "\\sqrt{u_x^2+u_y^2}=1",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Squaring both sides gives"
        },
        {
          "type": "equation",
          "latex": "\\boxed{u_x^2+u_y^2=1}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "But this is exactly the equation of the **unit circle**."
        },
        {
          "type": "paragraph",
          "text": "So normalization has performed an important geometric transformation. The original point \\(M\\) may have been anywhere along the direction from the center. After normalization, its direction is represented by a point lying exactly one unit from the center."
        },
        {
          "type": "paragraph",
          "text": "In other words,"
        },
        {
          "type": "equation",
          "latex": "M\\quad\\longrightarrow\\quad d=M-C\\quad\\longrightarrow\\quad u=\\frac{d}{|d|}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "turns an arbitrary point into a direction represented on the unit circle."
        }
      ]
    },
    {
      "id": "6-the-coordinates-now-describe-proportions-of-the-unit-direction",
      "title": "6. The coordinates now describe proportions of the unit direction",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Because"
        },
        {
          "type": "equation",
          "latex": "u=(u_x,u_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "has total length \\(1\\), its coordinates now have a special meaning."
        },
        {
          "type": "paragraph",
          "text": "The horizontal component \\(u_x\\) tells us how much of the unit direction lies horizontally."
        },
        {
          "type": "paragraph",
          "text": "The vertical component \\(u_y\\) tells us how much of the unit direction lies vertically."
        },
        {
          "type": "paragraph",
          "text": "The vector no longer carries the arbitrary distance from the center to \\(M\\). It contains only the orientation of that direction."
        },
        {
          "type": "paragraph",
          "text": "This is why the unit circle is so useful. Every direction around the center can now be represented by one standardized point."
        }
      ]
    },
    {
      "id": "7-connecting-the-vertical-component-to-sine",
      "title": "7. Connecting the vertical component to sine",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Take the normalized vector"
        },
        {
          "type": "equation",
          "latex": "u=(u_x,u_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "and let its direction make an angle \\(\\theta\\) from the positive horizontal axis."
        },
        {
          "type": "paragraph",
          "text": "In a right-triangle interpretation, sine is the ratio"
        },
        {
          "type": "equation",
          "latex": "\\sin(\\theta)=\\frac{\\text{opposite}}{\\text{hypotenuse}}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "For the vector \\(u\\), the opposite side is its vertical component \\(u_y\\), while the hypotenuse is the vector's total length."
        },
        {
          "type": "paragraph",
          "text": "But normalization made that length equal to \\(1\\). Therefore"
        },
        {
          "type": "equation",
          "latex": "\\sin(\\theta)=\\frac{u_y}{1}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "so"
        },
        {
          "type": "equation",
          "latex": "\\boxed{\\sin(\\theta)=u_y}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "The vertical coordinate of a unit direction is therefore its sine value."
        },
        {
          "type": "paragraph",
          "text": "Similarly,"
        },
        {
          "type": "equation",
          "latex": "\\boxed{\\cos(\\theta)=u_x}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "So a normalized direction can be written as"
        },
        {
          "type": "equation",
          "latex": "\\boxed{u=(\\cos\\theta,\\sin\\theta)}",
          "important": true
        }
      ]
    },
    {
      "id": "8-what-we-have-derived-so-far",
      "title": "8. What we have derived so far",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Starting with an arbitrary point \\(M\\), we first find the displacement from the circle center:"
        },
        {
          "type": "equation",
          "latex": "\\boxed{d=M-C}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "The vector \\(d\\) contains both direction and distance. We calculate its length:"
        },
        {
          "type": "equation",
          "latex": "\\boxed{|d|=\\sqrt{d_x^2+d_y^2}}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "Then we divide by that length:"
        },
        {
          "type": "equation",
          "latex": "\\boxed{u=\\frac{d}{|d|}}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "which gives"
        },
        {
          "type": "equation",
          "latex": "\\boxed{|u|=1}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "The normalized vector therefore lies on the unit circle:"
        },
        {
          "type": "equation",
          "latex": "\\boxed{u_x^2+u_y^2=1}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "Its coordinates encode the horizontal and vertical components of the direction:"
        },
        {
          "type": "equation",
          "latex": "\\boxed{u=(\\cos\\theta,\\sin\\theta)}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "and consequently"
        },
        {
          "type": "equation",
          "latex": "\\boxed{\\sin\\theta=u_y}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "At this point we understand what a sine value means geometrically: it is the vertical coordinate of a direction represented on the unit circle."
        }
      ]
    },
    {
      "id": "9-the-question-that-remains",
      "title": "9. The question that remains",
      "blocks": [
        {
          "type": "paragraph",
          "text": "There is still one major gap."
        },
        {
          "type": "paragraph",
          "text": "We know that"
        },
        {
          "type": "equation",
          "latex": "\\sin(\\theta)=u_y",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "once the corresponding point on the unit circle is already known."
        },
        {
          "type": "paragraph",
          "text": "But this does not yet explain how an input such as"
        },
        {
          "type": "equation",
          "latex": "\\frac{\\pi}{15}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "determines that point."
        },
        {
          "type": "paragraph",
          "text": "Knowing that sine is the vertical coordinate does not automatically tell us how the sine function finds the coordinate from an arbitrary input."
        },
        {
          "type": "paragraph",
          "text": "So the next problem is:"
        },
        {
          "type": "quote",
          "text": "What exactly does the input \\(\\theta\\) mean, and how does it tell us how far to travel around the circle?"
        },
        {
          "type": "paragraph",
          "text": "To answer that, we need a natural measure of circular motion."
        },
        {
          "type": "paragraph",
          "text": "That measure is the **radian**."
        }
      ]
    },
    {
      "id": "10-why-we-need-a-measure-of-rotation",
      "title": "10. Why we need a measure of rotation",
      "blocks": [
        {
          "type": "paragraph",
          "text": "We have established that a normalized direction vector has the form"
        },
        {
          "type": "equation",
          "latex": "u=(u_x,u_y)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "and that its vertical coordinate is sine:"
        },
        {
          "type": "equation",
          "latex": "\\sin(\\theta)=u_y",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "But this introduces a new question:"
        },
        {
          "type": "quote",
          "text": "What exactly is the input \\(\\theta\\)?"
        },
        {
          "type": "paragraph",
          "text": "The input must tell us how far we have rotated around the circle."
        },
        {
          "type": "paragraph",
          "text": "We begin at the standard starting point"
        },
        {
          "type": "equation",
          "latex": "(1,0)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "on the unit circle."
        },
        {
          "type": "paragraph",
          "text": "A positive input means travelling counterclockwise around the circle. A negative input means travelling clockwise."
        },
        {
          "type": "paragraph",
          "text": "The input therefore describes **circular travel**, not horizontal or vertical travel."
        }
      ]
    },
    {
      "id": "11-defining-a-radian",
      "title": "11. Defining a radian",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Consider a circle with radius \\(r\\)."
        },
        {
          "type": "paragraph",
          "text": "Suppose we travel a distance \\(s\\) along its circumference. This curved distance is called the **arc length**."
        },
        {
          "type": "paragraph",
          "text": "The angle in radians is defined as"
        },
        {
          "type": "equation",
          "latex": "\\boxed{\\theta=\\frac{s}{r}}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "where:"
        },
        {
          "type": "list",
          "items": [
            "\\(s\\) is the travelled arc length;",
            "\\(r\\) is the radius;",
            "\\(\\theta\\) is the resulting angle in radians."
          ]
        },
        {
          "type": "paragraph",
          "text": "This definition compares the curved distance travelled with the size of the circle."
        },
        {
          "type": "paragraph",
          "text": "If"
        },
        {
          "type": "equation",
          "latex": "s=r",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "then"
        },
        {
          "type": "equation",
          "latex": "\\theta=\\frac{r}{r}=1",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "So one radian is the rotation produced when the arc length equals the radius."
        }
      ]
    },
    {
      "id": "12-why-radians-remove-the-size-of-the-circle",
      "title": "12. Why radians remove the size of the circle",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Suppose we have two circles with different radii, but on both circles we travel through the same fraction of a revolution."
        },
        {
          "type": "paragraph",
          "text": "Take a quarter of a revolution."
        },
        {
          "type": "paragraph",
          "text": "For the first circle, let the radius be"
        },
        {
          "type": "equation",
          "latex": "r=1",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Its circumference is"
        },
        {
          "type": "equation",
          "latex": "2\\pi r=2\\pi",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "so one quarter of its circumference has arc length"
        },
        {
          "type": "equation",
          "latex": "s=\\frac{2\\pi}{4}=\\frac{\\pi}{2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "The angle in radians is"
        },
        {
          "type": "equation",
          "latex": "\\theta=\\frac{s}{r}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Therefore,"
        },
        {
          "type": "equation",
          "latex": "\\theta=\\frac{\\frac{\\pi}{2}}{1}=\\frac{\\pi}{2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Now consider a larger circle with radius"
        },
        {
          "type": "equation",
          "latex": "r=3",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Its circumference is"
        },
        {
          "type": "equation",
          "latex": "2\\pi r=6\\pi",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "One quarter of this circumference has arc length"
        },
        {
          "type": "equation",
          "latex": "s=\\frac{6\\pi}{4}=\\frac{3\\pi}{2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "The travelled arc is now three times longer because the circle itself is three times larger."
        },
        {
          "type": "paragraph",
          "text": "But the angle in radians is still calculated by"
        },
        {
          "type": "equation",
          "latex": "\\theta=\\frac{s}{r}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "so"
        },
        {
          "type": "equation",
          "latex": "\\theta=\\frac{\\frac{3\\pi}{2}}{3}=\\frac{\\pi}{2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Therefore, both circles give exactly the same radian value:"
        },
        {
          "type": "equation",
          "latex": "\\boxed{\\theta=\\frac{\\pi}{2}}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "even though the actual distances travelled around their circumferences are different."
        },
        {
          "type": "paragraph",
          "text": "For the smaller circle,"
        },
        {
          "type": "equation",
          "latex": "s=\\frac{\\pi}{2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "while for the larger circle,"
        },
        {
          "type": "equation",
          "latex": "s=\\frac{3\\pi}{2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "but after dividing the arc length by the radius,"
        },
        {
          "type": "equation",
          "latex": "\\frac{s}{r}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "the difference in physical size disappears."
        },
        {
          "type": "paragraph",
          "text": "This is why the angle is not simply the raw arc length \\(s\\)."
        },
        {
          "type": "paragraph",
          "text": "The angle is the **normalized arc length**"
        }
      ]
    },
    {
      "id": "15-interpreting-the-arc-15",
      "title": "15. Interpreting the arc \\(\\frac{\\pi}{15}\\)",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Suppose the input is"
        },
        {
          "type": "equation",
          "latex": "\\theta=\\frac{\\pi}{15}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "The complete circumference of the unit circle is"
        },
        {
          "type": "equation",
          "latex": "2\\pi",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "The fraction of the circumference represented by this arc is"
        },
        {
          "type": "equation",
          "latex": "\\frac{\\frac{\\pi}{15}}{2\\pi}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Dividing by \\(2\\pi\\) means comparing the given arc with the complete circumference."
        },
        {
          "type": "paragraph",
          "text": "Simplify:"
        },
        {
          "type": "equation",
          "latex": "\\frac{\\frac{\\pi}{15}}{2\\pi}\n=\n\n\\frac{\\pi}{15}\\cdot\\frac{1}{2\\pi}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Cancel \\(\\pi\\):"
        },
        {
          "type": "equation",
          "latex": "\\frac{1}{15}\\cdot\\frac{1}{2}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Therefore,"
        },
        {
          "type": "equation",
          "latex": "\\boxed{\n\\frac{\\frac{\\pi}{15}}{2\\pi}\n=\n\n\\frac{1}{30}\n}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "So"
        },
        {
          "type": "equation",
          "latex": "\\frac{\\pi}{15}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "radians represents one thirtieth of a complete revolution."
        },
        {
          "type": "paragraph",
          "text": "This tells us how far to travel around the circumference."
        },
        {
          "type": "paragraph",
          "text": "It does **not yet directly tell us the vertical coordinate**."
        }
      ]
    },
    {
      "id": "16-from-an-arc-to-a-point",
      "title": "16. From an arc to a point",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Start at"
        },
        {
          "type": "equation",
          "latex": "P(0)=(1,0)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "The notation \\(P(0)\\) means the point reached after travelling zero radians."
        },
        {
          "type": "paragraph",
          "text": "Now travel counterclockwise along the unit circle through an arc of length"
        },
        {
          "type": "equation",
          "latex": "\\frac{\\pi}{15}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "The final point is"
        },
        {
          "type": "equation",
          "latex": "P\\left(\\frac{\\pi}{15}\\right)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Because every point on the unit circle can be written as"
        },
        {
          "type": "equation",
          "latex": "P(\\theta)=\n\\left(\n\\cos\\theta,\\sin\\theta\n\\right)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "we have"
        },
        {
          "type": "equation",
          "latex": "P\\left(\\frac{\\pi}{15}\\right)\n=\n\n\\left(\n\\cos\\frac{\\pi}{15},\n\\sin\\frac{\\pi}{15}\n\\right)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "Therefore,"
        },
        {
          "type": "equation",
          "latex": "\\boxed{\n\\sin\\left(\\frac{\\pi}{15}\\right)\n}",
          "important": true
        },
        {
          "type": "paragraph",
          "text": "is the vertical coordinate of the point reached after travelling counterclockwise by the arc"
        },
        {
          "type": "equation",
          "latex": "\\frac{\\pi}{15}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "from \\((1,0)\\)."
        },
        {
          "type": "paragraph",
          "text": "The essential chain is"
        },
        {
          "type": "equation",
          "latex": "\\frac{\\pi}{15}\n\\quad\\longrightarrow\\quad\n\\text{travel this arc around the unit circle}",
          "important": false
        },
        {
          "type": "equation",
          "latex": "\\longrightarrow\n\\quad\n\\text{arrive at a particular point}",
          "important": false
        },
        {
          "type": "equation",
          "latex": "\\longrightarrow\n\\quad\n\\text{read its vertical coordinate}",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "That vertical coordinate is"
        },
        {
          "type": "equation",
          "latex": "\\sin\\left(\\frac{\\pi}{15}\\right)",
          "important": false
        }
      ]
    },
    {
      "id": "17-why-the-coordinate-is-not-obtained-by-a-linear-calculation",
      "title": "17. Why the coordinate is not obtained by a linear calculation",
      "blocks": [
        {
          "type": "paragraph",
          "text": "The motion around the circle is curved."
        },
        {
          "type": "paragraph",
          "text": "If the input \\(\\theta\\) increases at a constant rate, the point travels around the circumference at a constant speed. However, its horizontal and vertical coordinates do not change at constant rates."
        },
        {
          "type": "paragraph",
          "text": "Write the point as"
        },
        {
          "type": "equation",
          "latex": "P(\\theta)=(x(\\theta),y(\\theta))",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "The vertical coordinate does not satisfy a linear relationship such as"
        },
        {
          "type": "equation",
          "latex": "y(\\theta)=k\\theta",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "because the point does not move directly upward."
        },
        {
          "type": "paragraph",
          "text": "Near \\((1,0)\\), most of its movement is upward."
        },
        {
          "type": "paragraph",
          "text": "Near the top of the circle, most of its movement is horizontal."
        },
        {
          "type": "paragraph",
          "text": "Later, its vertical coordinate begins decreasing even though the travelled arc continues increasing."
        },
        {
          "type": "paragraph",
          "text": "Therefore, equal increases in arc length do not produce equal increases in vertical height."
        },
        {
          "type": "paragraph",
          "text": "The mapping"
        },
        {
          "type": "equation",
          "latex": "\\theta\\longmapsto y(\\theta)",
          "important": false
        },
        {
          "type": "paragraph",
          "text": "is nonlinear."
        },
        {
          "type": "paragraph",
          "text": "Sine is precisely the function that performs this nonlinear mapping:"
        },
        {
          "type": "equation",
          "latex": "\\boxed{\n\\text{arc travelled}\n\\longmapsto\n\\text{vertical coordinate}\n}",
          "important": true
        }
      ]
    },
    
  ]
};
