//
//  PostTableViewCell.swift
//  EpiReddit
//
//  Created by Corentin Garcia on 29/06/2018.
//  Copyright © 2018 Novus. All rights reserved.
//

import UIKit

class PostTableViewCell: UITableViewCell {

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var authorLabel: UILabel!
    @IBOutlet weak var infosLabel: UILabel!
    @IBOutlet weak var ratingLabel: UILabel!
    @IBOutlet weak var downVoteButton: UIButton!
    @IBOutlet weak var upVoteButton: UIButton!
    
    // Actions for buttons
    var onUpvote: (() -> Void)? = nil
    var onDownvote: (() -> Void)? = nil

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    @IBAction func onUpvoteClick(_ sender: Any) {
        if onUpvote != nil {
            onUpvote!()
        }
    }
    
    @IBAction func onDownvoteClick(_ sender: Any) {
        if onDownvote != nil {
            onDownvote!()
        }
    }
}
