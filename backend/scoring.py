#Core logic for scoring the quiz
# scoring.py

from quiz_data import SCORING, FACTIONS

def calculate_scores(answers: dict) -> dict:
    """
    Compute total alignment scores for each faction based on user answers.

    :param answers: dict[int, int] — {question_id: answer_value}, where
                    answer_value ∈ [-3, -2, -1, 0, 1, 2, 3]
    :return: dict[str, float] — faction name → normalized score (0–100)
    """
    totals = {faction: 0 for faction in FACTIONS}
    max_possible = {faction: 0 for faction in FACTIONS}

    for qid, answer in answers.items():
        if qid not in SCORING:
            continue
        for faction, weight in SCORING[qid].items():
            totals[faction] += answer * weight
            max_possible[faction] += abs(weight) * 3  # max possible if fully aligned

    # normalize to 0–100
    normalized = {}
    for faction in FACTIONS:
        if max_possible[faction] == 0:
            normalized[faction] = 50
        else:
            score = (totals[faction] / max_possible[faction] + 1) / 2 * 100
            normalized[faction] = round(score, 2)

    return normalized


def get_top_factions(scores: dict, top_n: int = 3) -> list[tuple[str, float]]:
    """
    Return top N factions by score.
    """
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
