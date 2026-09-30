
CREATE OR REPLACE FUNCTION grant_codeclash_stardust()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.username = 'codeclash' THEN
        IF EXISTS (SELECT 1 FROM wallets WHERE user_id = NEW.user_id) THEN
            UPDATE wallets SET balance = 700, updated_at = NOW() WHERE user_id = NEW.user_id;
        ELSE
            INSERT INTO wallets (user_id, balance) VALUES (NEW.user_id, 1000);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_grant_codeclash_stardust ON users;
CREATE TRIGGER trg_grant_codeclash_stardust
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION grant_codeclash_stardust();