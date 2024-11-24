using SoccerStats.Infrastructure;

public class Match
{
    public Area Area { get; set; }
    public Competition Competition { get; set; }
    public Season Season { get; set; }
    public int Id { get; set; }
    public string UtcDate { get; set; }
    public string Status { get; set; }
    public int Matchday { get; set; }
    public string Stage { get; set; }
    public object Group { get; set; }
    public string LastUpdated { get; set; }
    public Team HomeTeam { get; set; }
    public Team AwayTeam { get; set; }
    public Score Score { get; set; }
    public Odds Odds { get; set; }
    public List<Referee> Referees { get; set; }

    public string GetGameScore()
    {
        return Status == Globals.Statuses.FINISHED ?
                                        $"{Score.FullTime.Home}-{Score.FullTime.Away}"
                                        : "Match scheduled";
    }
}
