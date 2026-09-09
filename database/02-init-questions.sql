WITH seed (
    game_mode,
    difficulty,
    title,
    description,
    time_limit,
    answer_format,
    answer_precision,
    answer
) AS (
    VALUES
        ('math'::GAME_MODES, 2, 'Linear Equations', 'Solve the following system of equations:\n2x + 3y = 11\n4x - y = 7\nAnswer format: x=..., y=... using exact fractions, e.g. x=3/4, y=-1/2', '00:02:00'::TIME(2), 'variables'::ANSWER_FORMATS, NULL::INTEGER, 'x=16/7,y=15/7'),
        ('math', 1, 'Evaluate Quadratic Function', 'If f(x) = 3x² - 5x + 2, find the value of f(-2).\nAnswer format: a single number, e.g. 243', '00:01:00', 'numeric', NULL, '24'),
        ('math', 2, 'Algebraic Simplification', 'Simplify the expression:\n((x² - 4)(x + 1)) / ((x - 2)(x² - 1))\nAnswer format: a fully simplified expression of x, e.g. (x+8)/(x-9)', '00:02:00', 'simplified', NULL, '(x+2)/(x-1)'),
        ('math', 2, 'Solve Quadratic Equation', 'Find the roots of the quadratic equation:\nx² - 7x + 10 = 0\nAnswer format: comma seperated values, any order, e.g. 9,-3', '00:02:00', 'set', NULL, '5,2'),
        ('math', 1, 'Arithmetic Sequence', 'Given that the first term of an arithmetic sequence is 5 and the common difference is 3, find the 15th term.\nAnswer format: a single number, e.g. 23', '00:03:00', 'numeric', NULL, '47'),
        ('math', 3, 'Solve Exponential Equation', 'Solve for x:\n5^(x + 1) = 125\nAnswer format: x=.... using exact fractions where necessary, e.g. x=4', '00:02:00', 'variables', NULL, 'x=2'),
        ('math', 3, 'Rectangle Area Problem', 'If a rectangle has a length of (2x + 1) units and a width of (x - 3) units, and its area is 20 square units, find the possible values of x.\nAnswer format: a single umber rounded to 2 decimal places, e.g. 1.76', '00:04:00', 'decimal', 2, '(5 + sqrt(209))/4'),
        ('math', 2, 'Equation of a Straight Line', 'Determine the equation of a line that passes through the point (3, -2) and has a slope of 1/2.\nAnswer in the form ax + by = c.\nAnswer format: an equation in the form ax + by = c, e.g. 3x - 2y = 5', '00:02:00', 'equation', NULL, 'x-2y=7'),
        ('math', 3, 'Factor Cubic Polynomial', 'Factor the cubic polynomial:\nx³ - 2x² - 5x + 6\nAnswer format: a product of linear factors, e.g. (x-3)(x-7)(x+9)', '00:03:00', 'factored', NULL, '(x-1)(x-3)(x+2)'),
        ('math', 2, 'Geometric Sequence Sum', 'Given a geometric sequence with the first term a = 4 and the common ratio r = 2, find the sum of the first 6 terms.\nAnswer format: a single number, e.g. 252', '00:02:00', 'numeric', NULL, '252'),
        ('programming', 3, 'Reverse a String', 'Provide the C++ code such that, given a string "s", return the string reversed.\n Example: input "hello" -> output "olleh".', '00:05:00', NULL, NULL, 'olleh'),
        ('programming', 2, 'Nth Fibonacci Number', 'Write a function that outputs the nth Fibonacci number.\nExample" fibonacci(10) -> output 55.', '00:05:00', NULL, NULL, '55')
),
new_questions AS (
    INSERT INTO questions (
        game_mode, difficulty, title, description, time_limit, answer_format, answer_precision
    )
    SELECT
        game_mode, difficulty, title, description, time_limit, answer_format, answer_precision
    FROM seed
    RETURNING question_id, title
)
INSERT INTO answers (question_id, answer)
SELECT
    new_questions.question_id,
    seed.answer
FROM new_questions
JOIN seed ON seed.title = new_questions.title;