-- Question 1
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            2,
            'Linear Equations',
            'Solve the following system of equations:\n2x + 3y = 11\n4x - y = 7',
            '00:02:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    'x=16/7,y=15/7'
FROM
    q;

-- Question 2 
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            1,
            'Evaluate Quadratic Function',
            'If f(x) = 3x² - 5x + 2, find the value of f(-2).',
            '00:01:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    '24'
FROM
    q;

-- Question 3 
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            2,
            'Algebraic Simplification',
            'Simplify the expression:\n((x² - 4)(x + 1)) / ((x - 2)(x² - 1))',
            '00:02:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    '(x+2)/(x-1)'
FROM
    q;

-- Question 4
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            2,
            'Solve Quadratic Equation',
            'Find the roots of the quadratic equation:\nx² - 7x + 10 = 0',
            '00:02:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    '5,2'
FROM
    q;

-- Question 5
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            1,
            'Arithmetic Sequence',
            'Given that the first term of an arithmetic sequence is 5 and the common difference is 3, find the 15th term.',
            '00:03:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    '47'
FROM
    q;

-- Question 6
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            3,
            'Solve Exponential Equation',
            'Solve for x:\n5^(x + 1) = 125',
            '00:02:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    'x=2'
FROM
    q;

-- Question 7
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            3,
            'Rectangle Area Problem',
            'If a rectangle has a length of (2x + 1) units and a width of (x - 3) units, and its area is 20 square units, find the possible values of x.\nRound to 2 decimal points if needed',
            '00:04:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    '4.86'
FROM
    q;

-- Question 8
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            2,
            'Equation of a Straight Line',
            'Determine the equation of a line that passes through the point (3, -2) and has a slope of 1/2.\nAnswer in the form ax + by = c',
            '00:02:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    'x-2y=7'
FROM
    q;

-- Question 9
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            3,
            'Factor Cubic Polynomial',
            'Factor the cubic polynomial:\nx³ - 2x² - 5x + 6',
            '00:03:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    '(x-1)(x-3)(x+2)'
FROM
    q;

-- Question 10
WITH q AS (
    INSERT INTO
        questions(
            game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'math', --NOSONAR
            2,
            'Geometric Sequence Sum',
            'Given a geometric sequence with the first term a = 4 and the common ratio r = 2, find the sum of the first 6 terms.',
            '00:02:00' --NOSONAR
        ) RETURNING question_id
)
INSERT INTO
    answers(question_id, answer)
SELECT
    question_id,
    '252'
FROM
    q;

-- PROGAMMING QUESTIONS 

WITH q AS (
    INSERT INTO 
        questions(
             game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
            'programming', --NOSONAR,
            3,
            'Reverse a String',
            'Given a string "s", return the string reversed.\n Example: input "hello" -> output "olleh".',
            "00:05:00" --NOSONAR

        ) RETURNING question_id
)
INSERT INTO 
answers(question_id, answer)
SELECT 
    question_id,
    'olleh'
FROM 
    q;

WITH q AS (
    INSERT INTO 
        questions(
             game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
             'programming', --NOSONAR,
             4,
             'Nth Fibonacci Number',
             'Write a function that outputs the nth Fibonacci number.\nExample" fibonacci(10) -> output 55.',
             "00:05:00" --NoSonar

        ) RETURNING question_id
)
INSERT INTO 
answers(question_id, answer)
SELECT 
    question_id,
    ''
FROM 
    q;

WITH q AS (
    INSERT INTO 
        questions(
             game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
             'programming', --NOSONAR

        ) RETURNING question_id
)
INSERT INTO 
answers(question_id, answer)
SELECT 
    question_id,
    ''
FROM 
    q;

WITH q AS (
    INSERT INTO 
        questions(
             game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
             'programming', --NOSONAR

        ) RETURNING question_id
)
INSERT INTO 
answers(question_id, answer)
SELECT 
    question_id,
    ''
FROM 
    q;

WITH q AS (
    INSERT INTO 
        questions(
             game_mode,
            difficulty,
            title,
            description,
            time_limit
        )
    VALUES
        (
             'programming', --NOSONAR

        ) RETURNING question_id
)
INSERT INTO 
answers(question_id, answer)
SELECT 
    question_id,
    ''
FROM 
    q;