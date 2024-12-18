﻿public class RootObject
{
    public Filters Filters { get; set; }
    public ResultSet ResultSet { get; set; }
    public List<Match> Matches { get; set; }
    public List<LeagueGameCollectionDto> MapToDto(Dictionary<int, string> leagues)
    {
        var resultbyLeagueDict = Matches.GroupBy(c => c.Competition.Id,
                                                      m => {
                                                          var (homeWin, draw, awayWin) = SoccerOddsGenerator.GenerateOdds();
                                                          return new MatchDto
                                                          {
                                                              GameTime = DateTime.Parse(m.UtcDate),
                                                              HomeTeamName = m.HomeTeam.Name,
                                                              AwayTeamName = m.AwayTeam.Name,
                                                              Score = m.GetGameScore(),
                                                              HomeTeamWinOdds = homeWin.ToString(),
                                                              DrawOdds = draw.ToString(),
                                                              AwayTeamWinOdds = awayWin.ToString(),
                                                          };
                                                      })
                                        .ToList();

        Func<int, LeagueGameCollectionDto> selector = leagueId =>
        {
            var leagueMatches = resultbyLeagueDict
                .Where(x => x.Key == leagueId)
                .Select(x => new LeagueGameCollectionDto
                {
                    LeagueCode = x.Key.ToString(),
                    LeagueName = leagues[x.Key],
                    Matches = x.OrderBy(y => y.GameTime).ToList()
                })
                .FirstOrDefault();

            return leagueMatches;
        };
        
        return leagues.Keys.Select(selector).Where(x => x != null).ToList();

    }
}