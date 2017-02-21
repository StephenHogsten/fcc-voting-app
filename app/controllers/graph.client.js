'use strict';

function addGraph(ctx, pollId) {
  console.log('adding graph')
  userHandler.ajaxJson('/api/poll/' + pollId, (json) => {
    var labels = json.votes.map((a) => a.optionText);
    var dataset = json.votes.map((a) => Number(a.votes));
    var totalVotes = dataset.reduce((a, b) => a+b);
    if (totalVotes === 0) {
      d3.select('.container').insert('div', 'canvas')
        .classed('row', true)
        .append('h3')
          .classed('col-xs-6 col-xs-offset-3 col-md-6 col-md-offset-3', true)
          .text('no votes have been submitted yet');
      return;
    }
    var data = {
      'labels': labels,
      'datasets': [{
        'data': dataset,
        'label': "total votes",
        'backgroundColor': d3.schemeCategory20
      }]
    };
    var doughChart = new Chart(ctx, {
      'type': 'doughnut',
      'data': data
    });
  });
}